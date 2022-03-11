import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { allTheLevels } from "fixtures/levelsFixtures";
import { quarterRange } from "main/utils/quarterUtilities";

import SingleQuarterDropdown from "../Quarters/SingleQuarterDropdown";
import SingleSubjectDropdown from "../Subjects/SingleSubjectDropdown";
import SingleLevelDropdown from "../Levels/SingleLevelDropdown";
import { useBackendMutation } from "main/utils/useBackend";

const BasicCourseSearchForm = ({ setCourseJSON, fetchJSON }) => {
  const quarters = quarterRange("20084", "20222");

  // Stryker disable all : not sure how to test/mock local storage
  const localSubject = localStorage.getItem("BasicSearch.Subject");
  const localQuarter = localStorage.getItem("BasicSearch.Quarter");
  const localLevel = localStorage.getItem("BasicSearch.CourseLevel");

  const loadObjectToAxiosParams = () => ({
    url: "/api/UCSBSubjects/load",
    method: "POST",
    params: {},
  });

  const getObjectToAxiosParams = () => ({
    url: "/api/UCSBSubjects/all",
    method: "GET",
    params: {},
  });

  const onSuccess = (listSubjects) => {
    setSubjects(listSubjects);
  };

  const loadMutation = useBackendMutation(
    loadObjectToAxiosParams,
    {},
    // Stryker disable next-line all : hard to set up test for caching
    []
  );

  const getMutation = useBackendMutation(
    getObjectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    []
  );

  useEffect(() => {
    loadMutation.mutate();
    getMutation.mutate();
  }, []);

  const [quarter, setQuarter] = useState(localQuarter || quarters[0].yyyyq);
  const [subject, setSubject] = useState(localSubject || {});
  const [subjects, setSubjects] = useState([]);
  const [level, setLevel] = useState(localLevel || "U");
  const [errorNotified, setErrorNotified] = useState(false);
  // Stryker restore all

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { quarter, subject, level }).then((courseJSON) => {
      setCourseJSON(courseJSON);
    });
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleQuarterDropdown
              quarters={quarters}
              quarter={quarter}
              setQuarter={setQuarter}
              controlId={"BasicSearch.Quarter"}
            />
          </Col>
          <Col md="auto">
            <SingleSubjectDropdown
              subjects={subjects}
              subject={subject}
              setSubject={setSubject}
              controlId={"BasicSearch.Subject"}
            />
          </Col>
          <Col md="auto">
            <SingleLevelDropdown
              levels={allTheLevels}
              level={level}
              setLevel={setLevel}
              controlId={"BasicSearch.Level"}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: 10 }}>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default BasicCourseSearchForm;
