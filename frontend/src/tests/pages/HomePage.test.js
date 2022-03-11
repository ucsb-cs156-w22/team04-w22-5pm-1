import {
  queryByPlaceholderText,
  render,
  waitFor,
} from "@testing-library/react";
import HomePage from "main/pages/HomePage";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { allTheSubjects, oneSubject } from "fixtures/subjectFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

describe("HomePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
  });

  test("calls UCSB Curriculum api correctly", async () => {
    const oneCourse = [
      {
        quarter: "20211",
        courseId: "CMPSC 8",
        title: "INTRO TO COMP SCI",
        description:
          "Introduction to computer program development for students with little to no programming experience. Basic programming concepts, variables and expressions, data and control structures, algorithms, debugging, program design, and documentation.",
        objLevelCode: "U",
        subjectArea: "CMPSC ",
        unitsFixed: 4,
      },
    ];

    axiosMock.onGet("/api/UCSBSubjects/all").reply(200, allTheSubjects);
    axiosMock
      .onGet("/api/public/basicsearch")
      .reply(200, { classes: oneCourse });

    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HomePage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const selectQuarter = getByLabelText("Quarter");
    userEvent.selectOptions(selectQuarter, "20211");
    const selectSubject = getByLabelText("Subject Area");
    await waitFor(() => {
      expect(getByLabelText("Subject Area")).toHaveTextContent("ANTH");
    });
    userEvent.selectOptions(selectSubject, "ANTH");
    const selectLevel = getByLabelText("Course Level");
    userEvent.selectOptions(selectLevel, "G");

    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    userEvent.click(submitButton);

    axiosMock.resetHistory();

    await waitFor(() => {
      expect(axiosMock.onGet("/api/public/basicsearch"));
    });

    expect(axiosMock.history.get[0].params).toEqual({
      qtr: "20211",
      dept: "ANTH",
      level: "G",
    });

    expect(mockToast).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith("1 Courses Retrieved");
  });
});
