"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/contexts/store";
import { X } from "lucide-react";

import { PostCard } from "@/components/dashboard/post-card";
import { CreatePostModal } from "@/components/dashboard/create-post-modal";
import { ChatWindow } from "@/components/dashboard/chat-window";
import { CommentSection } from "@/components/dashboard/comment-section";
import { PostDetailModal } from "@/components/dashboard/post-detail-modal";
import { NotificationCenter } from "@/components/dashboard/notification-center";
import { TrendingTopics } from "@/components/dashboard/trending-topics";
import { SuggestedUsers } from "@/components/dashboard/suggested-users";
import { OnlineFriends } from "@/components/dashboard/online-friends";
import { SearchBar } from "@/components/dashboard/search-bar";

// Mock data for posts
const mockPosts = [
  {
    id: 1,
    user: {
      name: "Minh Anh",
      username: "minhanh",
      avatar: "/api/placeholder?height=40&width=40&text=MA",
      verified: true,
    },
    content:
      "Vừa hoàn thành dự án UI/UX mới! Rất hào hứng để chia sẻ với mọi người 🎉 #UIUXDesign #Design",
    image: "/api/placeholder?height=400&width=600&text=UI/UX+Project",
    time: "10 phút trước",
    likes: 24,
    comments: [
      {
        id: 101,
        user: {
          name: "Hoàng Nam",
          username: "hoangnam",
          avatar: "/api/placeholder?height=40&width=40&text=HN",
          verified: false,
        },
        content: "Tuyệt vời quá! Mình rất thích thiết kế này.",
        time: "8 phút trước",
        likes: 3,
      },
      {
        id: 102,
        user: {
          name: "Thu Hà",
          username: "thuha",
          avatar: "/api/placeholder?height=40&width=40&text=TH",
          verified: true,
        },
        content: "Bạn có thể chia sẻ thêm về quy trình làm việc không?",
        time: "5 phút trước",
        likes: 1,
      },
    ],
    shares: 2,
    liked: false,
    saved: false,
  },
  {
    id: 2,
    user: {
      name: "Hoàng Nam",
      username: "hoangnam",
      avatar: "/api/placeholder?height=40&width=40&text=HN",
      verified: false,
    },
    content:
      "Hôm nay mình vừa học xong khóa React Advanced. Có ai đang làm việc với React không? Mình có vài câu hỏi muốn thảo luận. #ReactJS #WebDevelopment",
    image: "",
    time: "30 phút trước",
    likes: 15,
    comments: [
      {
        id: 201,
        user: {
          name: "Quang Minh",
          username: "quangminh",
          avatar: "/api/placeholder?height=40&width=40&text=QM",
          verified: true,
        },
        content: "Mình đang làm React được 2 năm rồi, bạn cần hỏi gì?",
        time: "25 phút trước",
        likes: 2,
      },
    ],
    shares: 1,
    liked: true,
    saved: false,
  },
  {
    id: 3,
    user: {
      name: "Thu Hà",
      username: "thuha",
      avatar: "/api/placeholder?height=40&width=40&text=TH",
      verified: true,
    },
    content:
      "Chuyến du lịch Đà Nẵng tuần trước. Cảnh đẹp quá mọi người ơi! #TravelVietnam #DaNang",
    image: "/api/placeholder?height=400&width=600&text=Da+Nang+Trip",
    time: "2 giờ trước",
    likes: 89,
    comments: [
      {
        id: 301,
        user: {
          name: "Minh Anh",
          username: "minhanh",
          avatar: "/api/placeholder?height=40&width=40&text=MA",
          verified: true,
        },
        content: "Đẹp quá! Lần sau mình cũng muốn đi.",
        time: "1 giờ trước",
        likes: 5,
      },
      {
        id: 302,
        user: {
          name: "Hoàng Nam",
          username: "hoangnam",
          avatar: "/api/placeholder?height=40&width=40&text=HN",
          verified: false,
        },
        content: "Bạn đi mấy ngày vậy? Chi phí khoảng bao nhiêu?",
        time: "45 phút trước",
        likes: 1,
      },
      {
        id: 303,
        user: {
          name: "Quang Minh",
          username: "quangminh",
          avatar: "/api/placeholder?height=40&width=40&text=QM",
          verified: true,
        },
        content: "Nhìn thích thật đấy! Đà Nẵng mùa này đẹp nhất.",
        time: "30 phút trước",
        likes: 2,
      },
    ],
    shares: 5,
    liked: false,
    saved: true,
  },
  {
    id: 4,
    user: {
      name: "Quang Minh",
      username: "quangminh",
      avatar: "/api/placeholder?height=40&width=40&text=QM",
      verified: true,
    },
    content:
      "Vừa đọc xong cuốn sách về AI và tương lai của công nghệ. Thực sự đáng đọc! Ai quan tâm mình có thể chia sẻ tên sách. #AITechnology #TechVietnam",
    image: "/api/placeholder?height=400&width=600&text=AI+Book",
    time: "5 giờ trước",
    likes: 45,
    comments: [
      {
        id: 401,
        user: {
          name: "Thu Hà",
          username: "thuha",
          avatar: "/api/placeholder?height=40&width=40&text=TH",
          verified: true,
        },
        content: "Tên sách là gì vậy bạn?",
        time: "4 giờ trước",
        likes: 0,
      },
      {
        id: 402,
        user: {
          name: "Hoàng Nam",
          username: "hoangnam",
          avatar: "/api/placeholder?height=40&width=40&text=HN",
          verified: false,
        },
        content: "Mình cũng đang tìm sách về AI, chia sẻ tên với mình nhé!",
        time: "3 giờ trước",
        likes: 1,
      },
    ],
    shares: 3,
    liked: false,
    saved: false,
  },
];

// Mock data for trending topics
const trendingTopics = [
  { id: 1, name: "#ReactJS", posts: 1240 },
  { id: 2, name: "#AITechnology", posts: 980 },
  { id: 3, name: "#WebDevelopment", posts: 854 },
  { id: 4, name: "#UXDesign", posts: 720 },
  { id: 5, name: "#TechVietnam", posts: 650 },
];

// Mock data for suggested users
const suggestedUsers = [
  {
    id: 1,
    name: "Lan Anh",
    username: "lananh",
    avatar: "/api/placeholder?height=40&width=40&text=LA",
    mutual: 5,
    verified: false,
  },
  {
    id: 2,
    name: "Đức Thắng",
    username: "ducthang",
    avatar: "/api/placeholder?height=40&width=40&text=DT",
    mutual: 3,
    verified: true,
  },
  {
    id: 3,
    name: "Mai Hương",
    username: "maihuong",
    avatar: "/api/placeholder?height=40&width=40&text=MH",
    mutual: 2,
    verified: false,
  },
];

// Mock data for new messages
const newMessages = [
  {
    id: 1,
    user: {
      name: "Minh Anh",
      username: "minhanh",
      avatar: "/api/placeholder?height=40&width=40&text=MA",
      online: true,
      verified: true,
      lastActive: null,
    },
    lastMessage: "Bạn đã xem dự án mới của mình chưa?",
    time: "2 phút trước",
    date: "2025-05-07T10:30:00",
    unread: true,
    seen: false,
    conversation: [
      {
        id: 1001,
        sender: "minhanh",
        content: "Chào bạn, mình vừa hoàn thành dự án UI/UX mới",
        time: "10:15",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 1002,
        sender: "datducnguyen",
        content: "Ồ, tuyệt vời! Dự án gì vậy?",
        time: "10:18",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 1003,
        sender: "minhanh",
        content: "Một ứng dụng quản lý công việc. Mình đã đăng lên Behance rồi",
        time: "10:25",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 1004,
        sender: "minhanh",
        content: "Bạn đã xem dự án mới của mình chưa?",
        time: "10:30",
        date: "2025-05-07",
        seen: false,
      },
    ],
  },
  {
    id: 2,
    user: {
      name: "Hoàng Nam",
      username: "hoangnam",
      avatar: "/api/placeholder?height=40&width=40&text=HN",
      online: false,
      verified: false,
      lastActive: "30 phút trước",
    },
    lastMessage: "Cảm ơn bạn đã giúp mình với vấn đề React hôm qua!",
    time: "30 phút trước",
    date: "2025-05-07T10:00:00",
    unread: true,
    seen: false,
    conversation: [
      {
        id: 2001,
        sender: "hoangnam",
        content: "Bạn ơi, mình đang gặp vấn đề với React hooks",
        time: "09:00",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 2002,
        sender: "datducnguyen",
        content: "Vấn đề gì vậy bạn?",
        time: "09:05",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 2003,
        sender: "hoangnam",
        content: "Mình không hiểu useEffect chạy khi nào",
        time: "09:10",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 2004,
        sender: "datducnguyen",
        content:
          "useEffect sẽ chạy sau khi component render xong. Nó có thể chạy một lần hoặc nhiều lần tùy thuộc vào dependency array. Nếu dependency array rỗng [], nó chỉ chạy một lần sau khi component mount. Nếu không có dependency array, nó sẽ chạy sau mỗi lần render. Nếu có các giá trị trong dependency array, nó sẽ chạy khi các giá trị đó thay đổi.",
        time: "09:15",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 2005,
        sender: "hoangnam",
        content: "Cảm ơn bạn đã giúp mình với vấn đề React hôm qua!",
        time: "10:00",
        date: "2025-05-07",
        seen: false,
      },
    ],
  },
  {
    id: 3,
    user: {
      name: "Thu Hà",
      username: "thuha",
      avatar: "/api/placeholder?height=40&width=40&text=TH",
      online: true,
      verified: true,
      lastActive: null,
    },
    lastMessage: "Hẹn gặp lại vào cuối tuần nhé!",
    time: "1 giờ trước",
    date: "2025-05-07T09:30:00",
    unread: false,
    seen: true,
    conversation: [
      {
        id: 3001,
        sender: "thuha",
        content: "Chào bạn, cuối tuần này bạn có rảnh không?",
        time: "08:00",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 3002,
        sender: "datducnguyen",
        content: "Mình rảnh vào chiều thứ 7",
        time: "08:30",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 3003,
        sender: "thuha",
        content: "Tuyệt! Mình có một buổi gặp mặt nhỏ với nhóm dev",
        time: "09:15",
        date: "2025-05-07",
        seen: true,
      },
      {
        id: 3004,
        sender: "thuha",
        content: "Hẹn gặp lại vào cuối tuần nhé!",
        time: "09:30",
        date: "2025-05-07",
        seen: true,
      },
    ],
  },
];

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "message",
    user: {
      id: 1,
      name: "Minh Anh",
      avatar: "/api/placeholder?height=40&width=40&text=MA",
      verified: true,
    },
    content: "Bạn đã xem dự án mới của mình chưa?",
    time: "2 phút trước",
    unread: true,
    messageId: 1,
  },
  {
    id: 2,
    type: "like",
    user: {
      id: 2,
      name: "Hoàng Nam",
      avatar: "/api/placeholder?height=40&width=40&text=HN",
      verified: false,
    },
    content: "",
    time: "30 phút trước",
    unread: true,
    postId: 1,
  },
  {
    id: 3,
    type: "comment",
    user: {
      id: 3,
      name: "Thu Hà",
      avatar: "/api/placeholder?height=40&width=40&text=TH",
      verified: true,
    },
    content: "Đẹp quá! Lần sau mình cũng muốn đi.",
    time: "1 giờ trước",
    unread: false,
    postId: 3,
  },
  {
    id: 4,
    type: "follow",
    user: {
      id: 4,
      name: "Quang Minh",
      avatar: "/api/placeholder?height=40&width=40&text=QM",
      verified: true,
    },
    content: "",
    time: "3 giờ trước",
    unread: true,
  },
  {
    id: 5,
    type: "mention",
    user: {
      id: 5,
      name: "Lan Anh",
      avatar: "/api/placeholder?height=40&width=40&text=LA",
      verified: false,
    },
    content: "Bạn nghĩ sao về ý tưởng này @datducnguyen?",
    time: "5 giờ trước",
    unread: false,
    postId: 2,
  },
];

// Emoji data
const emojiCategories = [
  {
    name: "Smileys",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
    ],
  },
  {
    name: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "👇",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
    ],
  },
  {
    name: "Animals",
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
    ],
  },
  {
    name: "Food",
    emojis: [
      "🍏",
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
    ],
  },
];

export default function DashboardPage() {
  const { t } = useAppStore();
  const [posts, setPosts] = useState(mockPosts);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeChats, setActiveChats] = useState<number[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [showComments, setShowComments] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<{ [key: number]: string }>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Toggle like on a post
  const toggleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  };

  // Toggle save on a post
  const toggleSave = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            saved: !post.saved,
          };
        }
        return post;
      })
    );
  };

  // Show notification after component mount and hide after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotificationCenter(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowNotificationCenter(false);
    }, 20000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Handle new post submission
  const handlePostSubmit = (content: string, image: string) => {
    if (!content.trim()) return;

    const newPostObj = {
      id: Date.now(),
      user: {
        name: "Dat Duc Nguyen",
        username: "datducnguyen",
        avatar: "/api/placeholder?height=40&width=40&text=DDN",
        verified: true,
      },
      content: content,
      image: image,
      time: "Vừa xong",
      likes: 0,
      comments: [],
      shares: 0,
      liked: false,
      saved: false,
    };

    setPosts([newPostObj, ...posts]);
    setIsCreatePostOpen(false);
  };

  // Handle adding a new comment
  const handleAddComment = (postId: number, comment: string) => {
    if (!comment.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      user: {
        name: "Dat Duc Nguyen",
        username: "datducnguyen",
        avatar: "/api/placeholder?height=40&width=40&text=DDN",
        verified: true,
      },
      content: comment,
      time: "Vừa xong",
      likes: 0,
    };

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), newCommentObj],
          };
        }
        return post;
      })
    );
  };

  // Handle chat message sending
  const handleSendMessage = (userId: number, message: string) => {
    if (!message?.trim()) return;

    // Add message to conversation
    const chatUser = newMessages.find((m) => m.id === userId);
    if (chatUser) {
      const newMessageObj = {
        id: Date.now(),
        sender: "datducnguyen",
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toISOString().split("T")[0],
        seen: false,
      };

      chatUser.conversation.push(newMessageObj);
    }

    // Clear the input after sending
    setChatMessages({
      ...chatMessages,
      [userId]: "",
    });
  };

  // Toggle chat window
  const toggleChat = (userId: number) => {
    if (activeChats.includes(userId)) {
      // Close this chat
      setActiveChats(activeChats.filter((id) => id !== userId));
    } else {
      // Open this chat, but limit to 2 active chats
      if (activeChats.length >= 2) {
        // Remove the first chat in the array
        const newActiveChats = [...activeChats];
        newActiveChats.shift();
        setActiveChats([...newActiveChats, userId]);
      } else {
        setActiveChats([...activeChats, userId]);
      }
    }
  };

  // Get the selected post details
  const getSelectedPostDetails = () => {
    if (selectedPost === null) return null;
    return posts.find((post) => post.id === selectedPost) || null;
  };

  // Get the post for comments
  const getPostForComments = () => {
    if (showComments === null) return null;
    return posts.find((post) => post.id === showComments) || null;
  };

  // Handle search topic
  const handleSearchTopic = (topicName: string) => {
    setSearchQuery(topicName);
    setIsSearching(true);

    // Mô phỏng tìm kiếm - trong ứng dụng thực tế, bạn sẽ gọi API
    const filteredPosts = mockPosts.filter((post) =>
      post.content.toLowerCase().includes(topicName.toLowerCase())
    );

    setSearchResults(filteredPosts);
  };

  // Handle search input
  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    const filteredPosts = mockPosts.filter(
      (post) =>
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.user.name.toLowerCase().includes(query.toLowerCase()) ||
        post.user.username.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredPosts);
    setIsSearching(true);
  };

  // Handle chat input change
  const handleChatInputChange = (chatId: number, value: string) => {
    setChatMessages({
      ...chatMessages,
      [chatId]: value,
    });
  };

  // Handle notification actions
  const handleNotificationAction = (notification: any) => {
    // Xử lý các hành động khác nhau dựa trên loại thông báo
    switch (notification.type) {
      case "message":
        // Mở chat với người gửi tin nhắn
        toggleChat(notification.messageId);
        break;
      case "like":
      case "comment":
      case "mention":
        // Mở chi tiết bài viết
        if (notification.postId) {
          setSelectedPost(notification.postId);
        }
        break;
      case "follow":
        // Có thể mở trang profile của người theo dõi
        console.log("Xem profile của", notification.user.name);
        break;
      default:
        break;
    }

    // Đánh dấu thông báo đã đọc
    handleMarkNotificationAsRead(notification.id);
  };

  // Đánh dấu thông báo đã đọc
  const handleMarkNotificationAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            unread: false,
          };
        }
        return notification;
      })
    );
  };

  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  // Xem tất cả thông báo
  const handleViewAllNotifications = () => {
    console.log("Mở trang thông báo");
    setShowNotificationCenter(false);
    // Trong ứng dụng thực tế, bạn sẽ chuyển hướng đến trang thông báo
    // Ví dụ: router.push('/notifications')
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Main content */}
      <div className="container mx-auto grid grid-cols-1 gap-6 py-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Left sidebar - only visible on larger screens */}
        <div className="hidden md:block">
          <div className="sticky top-6 space-y-6">
            {/* Search */}
            <SearchBar onSearch={handleSearch} />

            {/* Trending */}
            <TrendingTopics
              topics={trendingTopics}
              onTopicClick={handleSearchTopic}
            />

            {/* Suggested users*/}
            <SuggestedUsers users={suggestedUsers} />
          </div>
        </div>

        {/* Main feed */}
        <div className="md:col-span-2">
          {/* Create post button */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src="/api/placeholder?height=40&width=40&text=DDN"
                    alt="Profile"
                  />
                  <AvatarFallback>DDN</AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  className="flex-1 justify-start text-slate-500"
                  onClick={() => setIsCreatePostOpen(true)}
                >
                  {t.whatsOnYourMind}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feed tabs */}
          <Tabs defaultValue="forYou" className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forYou">
                {t.forYou}
              </TabsTrigger>
              <TabsTrigger value="following">
                {t.following}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Posts */}
          <div className="space-y-6">
            {isSearching && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {t.searchResultsFor} "
                    {searchQuery}"
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearching(false)}
                  >
                    <X className="mr-1 h-4 w-4" />
                    {t.clear}
                  </Button>
                </div>
                <p className="text-sm text-slate-500">
                  {searchResults.length}{" "}
                  {t.resultsFound}
                </p>
              </div>
            )}

            {(isSearching ? searchResults : posts).map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={toggleLike}
                onSave={toggleSave}
                onShowComments={(postId) => setShowComments(postId)}
                onShowPostDetail={(postId) => setSelectedPost(postId)}
              />
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-6 space-y-6">
            {/* online friends */}
            <OnlineFriends messages={newMessages} onChatOpen={toggleChat} />
          </div>
        </div>
      </div>

      {/* Chat windows */}
      {activeChats.map((chatId, index) => {
        const chatUser = newMessages.find((m) => m.id === chatId);
        if (!chatUser) return null;

        return (
          <ChatWindow
            key={chatId}
            chatId={chatId}
            user={chatUser.user}
            conversation={chatUser.conversation}
            position={index}
            onClose={(id) =>
              setActiveChats(activeChats.filter((chatId) => chatId !== id))
            }
            onSendMessage={handleSendMessage}
            inputValue={chatMessages[chatId] || ""}
            onInputChange={handleChatInputChange}
          />
        );
      })}

      {/* Notification Center */}
      {showNotificationCenter && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotificationCenter(false)}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onAction={handleNotificationAction}
          onViewAll={handleViewAllNotifications}
        />
      )}

      {/* Post detail modal */}
      <PostDetailModal
        selectedPost={selectedPost}
        post={getSelectedPostDetails()}
        onClose={() => setSelectedPost(null)}
        onAddComment={handleAddComment}
      />

      {/* Comments modal */}
      <CommentSection
        postId={showComments}
        post={getPostForComments()}
        onClose={() => setShowComments(null)}
        onAddComment={handleAddComment}
      />

      {/* Create post modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handlePostSubmit}
      />
    </div>
  );
}