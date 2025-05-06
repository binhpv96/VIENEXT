import { NextResponse } from 'next/server';
import { publicRoutes, privateRoutes } from './src/lib/route-config';

export async function middleware(req) {
    const { pathname } = res.nextUrl;

    // Kiểm tra xem đường dẫn có nằm trong danh sách publicRoutes không
    if (publicRoutes.includes(pathname) || publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Kiểm tra xem đường dẫn có nằm trong danh sách privateRoutes không
    if (privateRoutes.includes(pathname) || privateRoutes.some(route => pathname.startsWith(route))) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                return NextResponse.redirect(new URL("/auth", req.url));
            }

            const userData = await response.json();
            // Có thể lưu userData vào context hoặc store nếu cần
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL("/auth", req.url));
        }
    }

    // Nếu không thuộc publicRoutes và privateRoutes, redirect 404
    return NextResponse.redirect(new URL("/404", req.url));
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
