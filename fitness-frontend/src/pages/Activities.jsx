import { useCallback, useEffect, useMemo, useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import useDebounce from "../hooks/useDebounce";

import SearchBar from "../components/common/SearchBar";
import Modal from "../components/common/Modal";
import EmptyState from "../components/common/EmptyState";
import AnimatedPage from "../components/common/AnimatedPage";
import AnimatedButton from "../components/common/AnimatedButton";

import ActivityFilter from "../components/activity/ActivityFilter";
import ActivityForm from "../components/activity/ActivityForm";
import ActivityTable from "../components/activity/ActivityTable";
import Pagination from "../components/activity/Pagination";

import { getActivities } from "../services/activityService";

import { paginate, pageCount } from "../utils/pagination";

const ITEMS_PER_PAGE = 5;

export default function Activities() {
    const [activities, setActivities] = useState([]);

    const [search, setSearch] = useState("");
    const [type, setType] = useState("ALL");
    const [sort, setSort] = useState("newest");

    const [currentPage, setCurrentPage] = useState(1);

    const [openModal, setOpenModal] = useState(false);

    const debouncedSearch = useDebounce(search, 300);

    const loadActivities = useCallback(async () => {
        const data = await getActivities();
        setActivities(data);
    }, []);

    useEffect(() => {
        loadActivities();
    }, [loadActivities]);

    const filteredActivities = useMemo(() => {
        return activities
            .filter((activity) =>
                activity.activityType
                    .toLowerCase()
                    .includes(debouncedSearch.toLowerCase())
            )
            .filter((activity) =>
                type === "ALL"
                    ? true
                    : activity.activityType === type
            )
            .sort((a, b) => {
                switch (sort) {
                    case "newest":
                        return (
                            new Date(b.activityDate) -
                            new Date(a.activityDate)
                        );

                    case "oldest":
                        return (
                            new Date(a.activityDate) -
                            new Date(b.activityDate)
                        );

                    case "caloriesHigh":
                        return (
                            b.caloriesBurned - a.caloriesBurned
                        );

                    case "caloriesLow":
                        return (
                            a.caloriesBurned - b.caloriesBurned
                        );

                    default:
                        return 0;
                }
            });
    }, [debouncedSearch, type, sort, activities]);

    const summary = useMemo(() => {
        return activities.reduce(
            (acc, activity) => ({
                calories:
                    acc.calories + (activity.caloriesBurned || 0),
                duration:
                    acc.duration + (activity.durationMinutes || 0),
                count: acc.count + 1,
            }),
            { calories: 0, duration: 0, count: 0 }
        );
    }, [activities]);

    const totalPages = pageCount(filteredActivities, ITEMS_PER_PAGE);

    const currentActivities = paginate(
        filteredActivities,
        currentPage,
        ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, type, sort]);

    return (
        <PageLayout>
            <AnimatedPage>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-[color:var(--text)] text-3xl font-bold">
                            Activities
                        </h1>

                        <AnimatedButton
                            onClick={() => setOpenModal(true)}
                            className="bg-blue-600 px-5 py-3 rounded-xl text-white"
                        >
                            + Add Activity
                        </AnimatedButton>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <SearchBar value={search} onChange={setSearch} />

                        <ActivityFilter
                            type={type}
                            setType={setType}
                            sort={sort}
                            setSort={setSort}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="surface border border-theme rounded-xl p-4 text-center">
                            <h2 className="text-[color:var(--text-secondary)] text-sm">
                                Calories Burned
                            </h2>
                            <p className="text-[color:var(--text)] text-2xl font-bold mt-1">
                                {summary.calories}
                            </p>
                        </div>

                        <div className="surface border border-theme rounded-xl p-4 text-center">
                            <h2 className="text-[color:var(--text-secondary)] text-sm">
                                Minutes Active
                            </h2>
                            <p className="text-[color:var(--text)] text-2xl font-bold mt-1">
                                {summary.duration}
                            </p>
                        </div>

                        <div className="surface border border-theme rounded-xl p-4 text-center">
                            <h2 className="text-[color:var(--text-secondary)] text-sm">
                                Total Workouts
                            </h2>
                            <p className="text-[color:var(--text)] text-2xl font-bold mt-1">
                                {summary.count}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <h2 className="text-[color:var(--text)] text-xl font-bold">
                            Activities
                        </h2>

                        <p className="text-[color:var(--text-secondary)]">
                            {filteredActivities.length} Result(s)
                        </p>
                    </div>

                    {currentActivities.length === 0 ? (
                        <EmptyState
                            title="No Activities Yet"
                            subtitle="Start by adding your first workout."
                        />
                    ) : (
                        <>
                            <ActivityTable
                                activities={currentActivities}
                            />

                            <Pagination
                                totalPages={totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </>
                    )}

                    <Modal
                        isOpen={openModal}
                        onClose={() => setOpenModal(false)}
                        title="Add Activity"
                    >
                        <ActivityForm
                            refresh={loadActivities}
                            closeModal={() => setOpenModal(false)}
                        />
                    </Modal>
                </div>
            </AnimatedPage>
        </PageLayout>
    );
}