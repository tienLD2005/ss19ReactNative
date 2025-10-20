import axiosInstance from "@/utils/axiosInstance";

export const getArticlesCategory = async () => {
    try {
        const response = await axiosInstance.get("article-categories/all");
        const resData = response.data;
        return resData;
    } catch (error) {
        throw error;
    }
}