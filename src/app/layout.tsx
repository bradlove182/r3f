import "@src/styles/globals.css";

export const metadata = {
    title: "Strange Attractors",
    icons: "favicon.png",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="bg-black">
            <body>{children}</body>
        </html>
    );
}
