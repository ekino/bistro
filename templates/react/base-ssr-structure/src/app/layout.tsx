export const metadata = {
    title: "Customize your title",
    description: "Customize your description",
};

export default function RootLayout({
   children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}