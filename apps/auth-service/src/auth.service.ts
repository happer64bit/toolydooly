import { hash, compare } from 'bcryptjs';
import * as userRepo from './user.repostiory';
import * as cache from './libs/cache';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './libs/jwt';

export const registerUser = async (username: string, email: string, password: string) => {
    const existing = await userRepo.findUserByIdentifier(email) || await userRepo.findUserByIdentifier(username);
    if (existing) throw new Error(existing.email === email ? "Email exists" : "Username exists");

    const hashedPassword = await hash(password, 12);
    const [user] = await userRepo.createUserInDb({ username, email, password: hashedPassword });

    await cache.setCache(email, { uid: user.uid, username: user.username, email: user.email });

    const accessToken = signAccessToken(user.uid);
    const refreshToken = signRefreshToken(user.uid);
    return { user, accessToken, refreshToken };
};

export const loginUser = async (identifier: string, password: string) => {
    const user = await userRepo.findUserByIdentifier(identifier);
    if (!user || !(await compare(password, user.password))) throw new Error("Invalid credentials");

    await cache.setCache(identifier, { uid: user.uid, username: user.username, email: user.email });

    return {
        user: { uid: user.uid, username: user.username, email: user.email },
        accessToken: signAccessToken(user.uid),
        refreshToken: signRefreshToken(user.uid)
    };
};

export const refreshUserToken = async (token: string) => {
    const payload = verifyRefreshToken(token);
    if (!payload || !payload.sub) {
        throw new Error("Invalid refresh token");
    }

    const userId = payload.sub.toString();

    let user = await cache.getCache(userId);

    if (!user) {
        user = await userRepo.findUserById(userId);
        if (!user) throw new Error("User not found");

        await cache.setCache(user.email, { 
            uid: user.uid, 
            username: user.username, 
            email: user.email 
        });
    }

    const accessToken = signAccessToken(user.uid);

    return accessToken;
};
