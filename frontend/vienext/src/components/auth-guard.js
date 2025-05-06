'use client'

import { useRouter } from "next/navigation"
import useAuthStore from "../contexts/authStore"

export default function AuthGuard({ children }) {
    const router = useRouter()
    const { isAuthenticated, setUser, clearUser } = useAuthStore()

    useEffect(() => {
        async function checkAuth() {
            if (isAuthenticated) return // Nếu đã xác thực thi khỏi kiểm tra

            try {
                const userData = await fetchUserData()
                setUser(userData) 
            } catch (error) {
                if (error.response?.status === 401) {
                    router.push("/login")
                }
            }
        }

        checkAuth()

    }, [isAuthenticated, router, setUser, clearUser])
    
    if (!isAuthenticated) {
        return <div>Sau này nhớ thay loading animation vào cho taooooo</div>
    }

    return children
}
