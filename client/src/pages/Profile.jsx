import React, { useEffect, useState } from "react";
import { User, Calendar, Award, Target, Clock } from "lucide-react";
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/common/Card";
import Button from "../components/common/Button";
import ProgressRing from "../components/common/ProgressRing";
import api from "../services/api"; // axios instance with baseURL + auth

const avatarPresets = [
  { id: "avatar1", label: "A", color: "#6366f1" },
  { id: "avatar2", label: "B", color: "#ec4899" },
  { id: "avatar3", label: "C", color: "#22c55e" },
  { id: "avatar4", label: "D", color: "#f97316" },
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local edit form state
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    experienceLevel: "Beginner",
    interestsText: "",
    avatarPreset: "avatar1",
    avatarColor: "#6366f1",
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoadingProfile(true);
        // Adjust if your API response shape is different
        // Expected: { success: true, data: { user: {...} } }
        const res = await api.get("/users/profile");
        const user = res.data?.data?.user || res.data?.user || res.data;

        setProfile(user);

        // Initialize form data from user
        setFormData({
          name: user.name || "",
          bio: user.bio || "",
          experienceLevel: user.experienceLevel || "Beginner",
          interestsText: Array.isArray(user.interests)
            ? user.interests.join(", ")
            : "",
          avatarPreset: user.avatar?.presetOption || "avatar1",
          avatarColor: user.avatar?.color || "#6366f1",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    if (!profile) return;
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!profile) {
      setIsEditing(false);
      return;
    }
    // Reset form to current profile values
    setFormData({
      name: profile.name || "",
      bio: profile.bio || "",
      experienceLevel: profile.experienceLevel || "Beginner",
      interestsText: Array.isArray(profile.interests)
        ? profile.interests.join(", ")
        : "",
      avatarPreset: profile.avatar?.presetOption || "avatar1",
      avatarColor: profile.avatar?.color || "#6366f1",
    });
    setIsEditing(false);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarPresetChange = (preset) => {
    const presetDef = avatarPresets.find((p) => p.id === preset);
    setFormData((prev) => ({
      ...prev,
      avatarPreset: preset,
      avatarColor: presetDef?.color || prev.avatarColor,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setIsSaving(true);

      const interestsArray = formData.interestsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name,
        bio: formData.bio,
        experienceLevel: formData.experienceLevel,
        interests: interestsArray,
        avatar: {
          type: "preset",
          presetOption: formData.avatarPreset,
          color: formData.avatarColor,
        },
      };

      // PUT /api/v1/users/profile
      const res = await api.put("/users/profile", payload);
      const updatedUser =
        res.data?.data?.user || res.data?.user || res.data || payload;

      setProfile(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      // you can show toast here if you use NotificationContext
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="container-custom py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container-custom py-8">
        <p className="text-red-500">
          Could not load profile. Please try refreshing or logging in again.
        </p>
      </div>
    );
  }

  const stats = profile.stats || {
    totalTechnologies: 0,
    completedTechnologies: 0,
    inProgressTechnologies: 0,
    totalHoursSpent: 0,
    streak: 0,
    level: 1,
  };

  const learningStats = [
    {
      label: "Technologies",
      value: stats.totalTechnologies,
      icon: Target,
    },
    {
      label: "Hours Learned",
      value: stats.totalHoursSpent,
      icon: Clock,
    },
    {
      label: "Current Streak",
      value: `${stats.streak} days`,
      icon: Award,
    },
    {
      label: "Level",
      value: stats.level,
      icon: User,
    },
  ];

  // Placeholder recent progress; ideally fetched from API
  const recentProgress = [
    {
      technology: "React.js",
      progress: 68,
      lastUpdated: "2 days ago",
    },
    {
      technology: "Node.js",
      progress: 45,
      lastUpdated: "1 week ago",
    },
    {
      technology: "MongoDB",
      progress: 30,
      lastUpdated: "2 weeks ago",
    },
  ];

  const completionPct =
    stats.totalTechnologies > 0
      ? Math.round((stats.completedTechnologies / stats.totalTechnologies) * 100)
      : 0;

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile and track your learning progress.
        </p>
      </div>

      {/* Edit form (inline card) */}
      {isEditing && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Name & Bio */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      handleFormChange("name", e.target.value)
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) =>
                      handleFormChange("experienceLevel", e.target.value)
                    }
                    className="input w-full"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) =>
                    handleFormChange("bio", e.target.value)
                  }
                  className="input w-full"
                  placeholder="Tell others about your learning goals, interests and background..."
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.interestsText}
                  onChange={(e) =>
                    handleFormChange("interestsText", e.target.value)
                  }
                  className="input w-full"
                  placeholder="Web Dev, AI/ML, DevOps"
                />
              </div>

              {/* Avatar presets */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Avatar
                </label>
                <div className="flex flex-wrap gap-3">
                  {avatarPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleAvatarPresetChange(preset.id)}
                      className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 text-xs ${
                        formData.avatarPreset === preset.id
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                          : "border-gray-300 dark:border-gray-700"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                        style={{ backgroundColor: preset.color }}
                      >
                        {preset.label}
                      </div>
                      <span>{preset.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="text-center">
              <div className="mb-4">
                <div
                  className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-white text-3xl font-bold"
                  style={{
                    backgroundColor:
                      profile.avatar?.color || "#6366f1",
                  }}
                >
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {profile.email}
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="badge badge-primary">
                  {profile.experienceLevel || "Beginner"}
                </span>
                <span className="badge badge-warning">
                  Level {stats.level}
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.bio || "No bio added yet."}
              </p>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(profile.interests || []).length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No interests added yet.
                  </span>
                )}
                {(profile.interests || []).map((interest) => (
                  <span
                    key={interest}
                    className="badge badge-secondary"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Member Since */}
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>
                  Member since{" "}
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats and Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Stats */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Learning Statistics
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {learningStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="text-center p-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Learning Journey
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {stats.completedTechnologies} of{" "}
                    {stats.totalTechnologies} technologies completed
                  </p>
                  <div className="flex space-x-8">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completed
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.completedTechnologies}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        In Progress
                      </p>
                      <p className="text-2xl font-bold text-primary-600">
                        {stats.inProgressTechnologies}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Hours
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalHoursSpent}
                      </p>
                    </div>
                  </div>
                </div>
                <ProgressRing
                  percentage={completionPct}
                  size={120}
                  color="success"
                  showPercentage={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Progress (still mock for now) */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProgress.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {item.technology}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last updated {item.lastUpdated}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <ProgressRing
                        percentage={item.progress}
                        size={60}
                        color="primary"
                        showPercentage={false}
                      />
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.progress}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
