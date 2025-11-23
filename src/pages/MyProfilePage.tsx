import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Layout, Avatar, Button } from "../components/common";
import styles from "./UserProfilePage.module.css";
import { useEffect, useState } from "react";
// import db from "@/lib/cocobase";

interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}
export const MyProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStats>({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
  });

  // const fetchStats = async () => {
  //   const res = await db.functions.execute("get-stats");
  //   if (res.success) {
  //     setStats(res.result as UserStats);
  //   }
  // };

  useEffect(() => {
    // fetchStats();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.profileCard}>
          <Avatar
            src={user?.data.avatarUrl}
            alt={user?.data.displayName || "User"}
            username={user?.data.displayName}
            size="xl"
          />

          <div className={styles.userInfo}>
            <h1 className={styles.displayName}>{user?.data.displayName}</h1>
            <p className={styles.username}>@{user?.data.username}</p>
            <p className={styles.bio}>{user?.data.bio || "No bio yet"}</p>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{stats.postsCount}</span>
                <span className={styles.statLabel}>Posts</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{stats.followersCount}</span>
                <span className={styles.statLabel}>Followers</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>{stats.followingCount}</span>
                <span className={styles.statLabel}>Following</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                onClick={() => navigate("/profile/edit")}
                variant="primary"
                fullWidth
              >
                Edit Profile
              </Button>
            
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
