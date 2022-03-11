import React from "react";
import OurTable from "main/components/OurTable";

import { yyyyqToQyy } from "main/utils/quarterUtilities.js";

export default function BasicCourseTable({ courses }) {

    const columns = [
        {
            Header: 'Quarter',
            accessor: (row, _rowIndex) => yyyyqToQyy(row.quarter),
            id: 'quarter',
        },
        {
            Header: 'Course Id',
            accessor: 'courseId',
        },
        {
            Header: 'Title',
            accessor: 'title',
        },
        {
            Header: 'Description',
            accessor: 'description',
        },
        {
            Header: 'Level Code',
            accessor: 'objLevelCode',
        },
        {
            Header: 'Subject Area',
            accessor: 'subjectArea',
        },
        {
            Header: 'Units',
            accessor: 'unitsFixed',
        },
    ];

    // Stryker disable next-line ArrayDeclaration : [columns] is a performance optimization
    const memoizedColumns = React.useMemo(() => columns, [columns]);
    // Stryker disable next-line ArrayDeclaration : [courses] is a performance optimization
    const memoizedCourses = React.useMemo(() => courses, [courses]);

    return <OurTable
        data={memoizedCourses}
        columns={memoizedColumns}
        testid={"BasicCourseTable"}
    />;
};