import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import PersonalSchedulesTable from 'main/components/PersonalSchedules/PersonalSchedulesTable';
import { useCurrentUser } from 'main/utils/currentUser'

export default function PersonalSchedulesIndexPage() {

  const currentUser = useCurrentUser();

  const { data: schedules, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/personalschedules/all"],
      { method: "GET", url: "/api/personalschedules/all" },
      []
    );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>PersonalSchedules</h1>
        <PersonalSchedulesTable schedules={schedules} currentUser={currentUser} />
      </div>
    </BasicLayout>
  )
}