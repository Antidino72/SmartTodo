export type MemberProps = {
    id: string;
    organizationId: string;
    role: "admin" | "member" | "owner";
    createdAt: Date;
    userId: string;
    user: {
        id: string;
        email: string;
        name: string;
        image?: string;
    };
};