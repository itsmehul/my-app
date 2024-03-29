import React from "react";
import Head from "next/head";
import styles from "../styles/ProtectedHome.module.css";
import SessionReact from "supertokens-auth-react/recipe/session";
import SuperTokensReact from "supertokens-auth-react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { BlogsIcon, CelebrateIcon, GuideIcon, SeparatorLine, SignOutIcon } from "../assets/images";
import Image from "next/image";
import { recipeDetails } from "../config/frontendConfig";

import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });


interface ILink {
    name: string;
    onClick: () => void;
    icon: string;
}

function ProtectedPage() {
    const session = useSessionContext();

    async function logoutClicked() {
        await SessionReact.signOut();
        SuperTokensReact.redirectToAuth();
    }

    async function fetchUserData() {
        const res = await fetch("/api/user");
        if (res.status === 200) {
            const json = await res.json();
            alert(JSON.stringify(json));
        }
    }

    if (session.loading === true) {
        return null;
    }

    function openLink(url: string) {
        window.open(url, "_blank");
    }

    const links: ILink[] = [
        {
            name: "Blogs",
            onClick: () => openLink("https://supertokens.com/blog"),
            icon: BlogsIcon,
        },
        {
            name: "Guides",
            onClick: () => openLink(recipeDetails.docsLink),
            icon: GuideIcon,
        },
        {
            name: "Sign Out",
            onClick: logoutClicked,
            icon: SignOutIcon,
        },
    ];

    return (
        <div className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
            <Head>
                <title>SuperTokens 💫</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.mainContainer}>
                <div className={`${styles.topBand} ${styles.successTitle} ${styles.bold500}`}>
                    <Image src={CelebrateIcon} alt="Login successful" className={styles.successIcon} /> Login successful
                </div>
                <div className={styles.innerContent}>
                    <div>Your userID is:</div>
                    <div className={`${styles.truncate} ${styles.userId}`}>{session.userId}</div>
                    <Button onClick={fetchUserData} >
                        Call API
                    </Button>
                </div>
            </div>
            <div className={styles.bottomLinksContainer}>
                {links.map((link) => (
                    <div className={styles.linksContainerLink} key={link.name}>
                        <Image className={styles.linkIcon} src={link.icon} alt={link.name} />
                        <Button onClick={link.onClick} variant='link'>
                            {link.name}
                        </Button>
                    </div>
                ))}
            </div>
            <Image className={styles.separatorLine} src={SeparatorLine} alt="separator" />
        </div>
    );
}

export default function Home() {
    return (
        <SessionReact.SessionAuth>
            <ProtectedPage />
        </SessionReact.SessionAuth>
    );
}
