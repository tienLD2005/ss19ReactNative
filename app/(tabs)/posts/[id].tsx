import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- ĐỊNH NGHĨA TYPE ĐỂ DÙNG LẠI ---
interface User {
  name: string;
  avatar: string;
}
interface CommentType {
  id: string;
  user: User;
  text: string;
  time: string;
  likes: number;
  replies: CommentType[];
}

// --- DỮ LIỆU FIX CỨNG (KHÔNG ĐỔI) ---
const POST_DETAIL = {
  title: "10 Mẹo hay để tối ưu hiệu năng ứng dụng React Native",
  author: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?u=a1" },
  image:
    "https://beitech.net/wp-content/uploads/2021/06/react-native-dung-de-lap-trinh-app1_opt.png",
  content:
    "Nội dung chi tiết của bài viết... Lập trình React Native đòi hỏi sự chú ý đến từng chi tiết nhỏ để đảm bảo ứng dụng không chỉ hoạt động đúng mà còn mượt mà. Sử dụng FlatList thay vì ScrollView cho các danh sách dài. Memoize các component nặng... (và nhiều nội dung khác).",
  likes: 1250,
};
const COMMENTS: CommentType[] = [
  {
    id: "c1",
    user: { name: "Bard", avatar: "https://i.pravatar.cc/150?u=a2" },
    text: "Bài viết rất hay và hữu ích!",
    time: "5 giờ trước",
    likes: 15,
    replies: [
      {
        id: "c3",
        user: { name: "Gemini AI", avatar: "https://i.pravatar.cc/150?u=a1" },
        text: "Cảm ơn bạn đã ủng hộ!",
        time: "4 giờ trước",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: "c2",
    user: { name: "Claude", avatar: "https://i.pravatar.cc/150?u=a3" },
    text: "Mình đã áp dụng và thấy hiệu quả rõ rệt!",
    time: "2 giờ trước",
    likes: 8,
    replies: [],
  },
];

// --- COMPONENT CON (ĐÃ CẬP NHẬT) ---
const Comment = ({
  comment,
  level = 0,
  onReply,
}: {
  comment: CommentType;
  level?: number;
  onReply: (comment: CommentType) => void;
}) => (
  <View style={{ marginLeft: level * 20, marginTop: 15 }}>
    <View style={styles.commentContainer}>
      <Image
        source={{ uri: comment.user.avatar }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentBody}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{comment.user.name}</Text>
          <Text style={styles.commentTime}>{comment.time}</Text>
        </View>
        <Text style={styles.commentText}>{comment.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={18} />
            <Text style={styles.actionText}> {comment.likes}</Text>
          </TouchableOpacity>
          {/* Khi nhấn Reply, gọi hàm onReply được truyền từ cha */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onReply(comment)}
          >
            <Ionicons name="chatbubble-outline" size={18} />
            <Text style={styles.actionText}> Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    {comment.replies.map((reply) => (
      <Comment
        key={reply.id}
        comment={reply}
        level={level + 1}
        onReply={onReply}
      />
    ))}
  </View>
);

// --- MÀN HÌNH CHÍNH (ĐÃ CẬP NHẬT) ---
export default function PostDetailScreen() {
  // State để lưu thông tin bình luận đang được trả lời
  const [replyingTo, setReplyingTo] = useState<CommentType | null>(null);
  // State để lưu nội dung đang gõ
  const [commentText, setCommentText] = useState("");
  // Ref để focus vào TextInput
  const inputRef = useRef<TextInput>(null);

  // Hàm được gọi khi nhấn nút "Reply" ở một bình luận
  const handleReplyPress = (comment: CommentType) => {
    setReplyingTo(comment);
    inputRef.current?.focus(); // Tự động focus vào ô nhập liệu
  };

  // Hàm xử lý khi nhấn nút gửi
  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    if (replyingTo) {
      // Logic gửi trả lời
      Alert.alert(
        "Gửi trả lời",
        `Nội dung: "${commentText}"\nTrả lời cho bình luận ID: ${replyingTo.id} của ${replyingTo.user.name}`
      );
    } else {
      // Logic gửi bình luận mới
      Alert.alert("Gửi bình luận mới", `Nội dung: "${commentText}"`);
    }

    // Reset state sau khi gửi
    setCommentText("");
    setReplyingTo(null);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <Image
            source={{ uri: POST_DETAIL.image }}
            style={styles.detailImage}
          />
          <View style={styles.contentContainer}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={styles.detailTitle}
            >
              {POST_DETAIL.title}
            </Text>
            <View style={styles.authorSection}>
              <Image
                source={{ uri: POST_DETAIL.author.avatar }}
                style={styles.authorAvatar}
              />
              <Text style={styles.authorName}>{POST_DETAIL.author.name}</Text>
            </View>
            <Text style={styles.detailContent}>{POST_DETAIL.content}</Text>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Bình luận ({COMMENTS.length})
            </Text>
            {COMMENTS.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                onReply={handleReplyPress}
              />
            ))}
          </View>
        </ScrollView>

        {/* --- PHẦN NHẬP LIỆU ĐÃ CẬP NHẬT --- */}
        <View style={styles.commentInputWrapper}>
          {/* Hiển thị thông báo khi đang trả lời bình luận */}
          {replyingTo && (
            <View style={styles.replyingContainer}>
              <Text style={styles.replyingText}>
                Đang trả lời {replyingTo.user.name}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close-circle" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.commentInputContainer}>
            <TextInput
              ref={inputRef}
              placeholder="Viết bình luận..."
              style={styles.commentInput}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleCommentSubmit}>
              <Ionicons name="send" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- STYLESHEET (ĐÃ CẬP NHẬT) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  keyboardAvoidingContainer: {
    // Style mới
    flex: 1,
  },
  detailImage: { width: "100%", height: 250 },
  contentContainer: { padding: 20 },
  detailTitle: { fontSize: 24, fontWeight: "bold" },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  authorAvatar: { width: 40, height: 40, borderRadius: 20 },
  authorName: { marginLeft: 10, fontSize: 16, fontWeight: "600" },
  detailContent: { fontSize: 16, lineHeight: 26, color: "#333" },
  commentsSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  commentsTitle: { fontSize: 18, fontWeight: "bold" },
  commentContainer: { flexDirection: "row" },
  commentAvatar: { width: 35, height: 35, borderRadius: 17.5 },
  commentBody: { flex: 1, marginLeft: 10 },
  commentHeader: { flexDirection: "row", alignItems: "center" },
  commentUser: { fontWeight: "bold" },
  commentTime: { marginLeft: 8, fontSize: 12, color: "gray" },
  commentText: { marginTop: 4 },
  commentActions: { flexDirection: "row", marginTop: 8 },
  actionButton: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  actionText: { marginLeft: 4, color: "gray" },

  // Styles mới cho phần nhập liệu
  commentInputWrapper: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "white",
  },
  replyingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
  },
  replyingText: {
    color: "#666",
    fontStyle: "italic",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
});
