import PageLayout from "../components/layout/PageLayout";
import AnimatedPage from "../components/common/AnimatedPage";

import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import AccountSettings from "../components/settings/AccountSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import DangerZone from "../components/settings/DangerZone";

export default function Settings() {
    return (
        <PageLayout>
            <AnimatedPage>
                <div className="space-y-8">
                    <div>
                        <h1 className="text-[color:var(--text)] text-3xl font-bold">
                            Settings
                        </h1>

                        <p className="text-[color:var(--text-secondary)] mt-2">
                            Manage your account preferences and application settings.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <AppearanceSettings />

                        <NotificationSettings />

                        <AccountSettings />

                        <SecuritySettings />

                        <DangerZone />
                    </div>
                </div>
            </AnimatedPage>
        </PageLayout>
    );
}