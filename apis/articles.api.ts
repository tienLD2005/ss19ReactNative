import axiosInstance from "@/utils/axiosInstance";

// Lấy danh sách bài viết (có phân trang)
export const getArticles = async (params?: Record<string, any>) => {
    try {
        const response = await axiosInstance.get("articles", { params });
        return response.data; // trả về res.data để UI quyết định shape
    } catch (error) {
        throw error;
    }
};

export const getArticlesMe = async () => {
    try {
        const response = await axiosInstance.get("articles/me/all");
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getArticleById = async (id: string | number) => {
    try {
        const response = await axiosInstance.get(`articles/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createArticle = async (payload: any) => {
    try {
        const config: any = {};
        if (typeof FormData !== "undefined" && payload instanceof FormData) {
            config.headers = { "Content-Type": "multipart/form-data" };
        }
        const response = await axiosInstance.post(`articles`, payload, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateArticle = async (id: string | number, payload: any) => {
    try {
        const config: any = {};
        if (typeof FormData !== "undefined" && payload instanceof FormData) {
            config.headers = { "Content-Type": "multipart/form-data" };
        }
        const response = await axiosInstance.put(`articles/${id}`, payload, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteArticle = async (id: string | number) => {
    try {
        const response = await axiosInstance.delete(`articles/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createComment = async (articleId: string | number, payload: any) => {
    try {
        const response = await axiosInstance.post(`comments`, { ...payload, articleId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteComment = async (id: string | number) => {
    try {
        const response = await axiosInstance.delete(`comments/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const toggleLike = async (payload: { articleId?: string | number; commentId?: string | number }) => {
    try {
        const response = await axiosInstance.post(`likes/toggle`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};