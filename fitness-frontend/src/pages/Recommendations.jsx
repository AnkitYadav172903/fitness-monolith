import { useEffect, useState } from "react";

import PageLayout from "../components/layout/PageLayout";
import Loader from "../components/common/Loader";
import AnimatedPage from "../components/common/AnimatedPage";

import RecommendationHero from "../components/recommendation/RecommendationHero";
import RecommendationFilter from "../components/recommendation/RecommendationFilter";
import RecommendationList from "../components/recommendation/RecommendationList";

import {
    getRecommendations,
    getRecommendationByGoal,
} from "../services/recommendationService";

export default function Recommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [goal, setGoal] = useState("ALL");

    useEffect(() => {
        loadRecommendations();
    }, []);

    useEffect(() => {
        if (goal === "ALL") {
            loadRecommendations();
        } else {
            loadGoalRecommendations();
        }
    }, [goal]);

    const loadRecommendations = async () => {
        try {
            const data = await getRecommendations();
            setRecommendations(data);
        } finally {
            setLoading(false);
        }
    };

    const loadGoalRecommendations = async () => {
        try {
            setLoading(true);
            const data = await getRecommendationByGoal(goal);
            setRecommendations(data);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <PageLayout>
            <AnimatedPage>
                <div className="space-y-8">
                    <RecommendationHero />

                    <RecommendationFilter
                        value={goal}
                        onChange={setGoal}
                    />

                    <RecommendationList
                        recommendations={recommendations}
                    />
                </div>
            </AnimatedPage>
        </PageLayout>
    );
}