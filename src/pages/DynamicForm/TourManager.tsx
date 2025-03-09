import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { ROUTES } from "@/Router";

export interface TourStep extends Step {
  path: string;
  action?:({navigate}:{navigate:any})=>void;
}


export const tourSteps: TourStep[] = [
  // Search Input for Forms
  {
    content: <div>Welcom to dyamic form creation</div>,
    path: ROUTES.FORMS,
    styles: {
      options: {
        width: 700,
      },
    },
    placement: "center",
    target: "body",
  },
  {
    target: ".form-search-input",
    content: "Use this search bar to find forms quickly.",
    path: ROUTES.FORMS,
  },
  // Sort Button for Forms
  {
    target: ".form-sort-button",
    content: "Click here to sort forms based on different criteria.",
    path: ROUTES.FORMS,
  },
  // Create Form Button
  {
    target: ".create-form-button",
    content: "Click here to create a new form.",
    path: ROUTES.FORMS,
  },
  // Navigate to Form Builder Page
  {
    target: ".create-form-button",
    content: "Let's go to the Form Builder page!",
    path: ROUTES.FORMS,
    action: ({navigate}) => navigate(ROUTES.CREATE_FORMS),
  },
  {
    target: "#formbuilder",
    content: "This is the Form Builder page where you can create your form.",
    path: ROUTES.FORMS,
  },
  {
    target: "#formjson",
    content: "This is the JSON representation of your form.",
    path: ROUTES.FORMS,
    placement:"left-start"
  },
  {
    target: "#viewForms",
    content: "On Click here to view the list of forms you have created.",
    path: ROUTES.FORMS,
  },
  {
    target: "#viewForms",
    content: "Click here to view the list of forms you have created. let's go to the form list page",
    path: ROUTES.FORMS,
    action: ({navigate}) => navigate(ROUTES.FORMS),
  },
  // Form Details Card
  {
    target: ".form-card-details",
    content: "This card shows the details of your forms.",
    path: ROUTES.FORMS,
  },
  // Form Preview Button
  {
    target: ".form-preview-button",
    content: "Click here to preview this form.",
    path: ROUTES.FORMS,
  },
  // View Submissions Button
  {
    target: ".form-submissions-button",
    content: "Click here to view the submissions for this form.",
    path: ROUTES.FORMS,
  },
];
interface TourManagerProps {
  isTourActive: boolean;
  setIsTourActive: (value: boolean) => void;
}

const TourManager: React.FC<TourManagerProps> = ({ isTourActive, setIsTourActive }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Activate the tour only on the FORMS page
  // useEffect(() => {
  //   if (location.pathname === ROUTES.FORMS) {
  //     setIsTourActive(true);
  //   } else {
  //     setIsTourActive(false);
  //   }
  // }, [location.pathname, setIsTourActive]);

  const handleTourCallback = (data: CallBackProps) => {
    const { status, action, index } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setIsTourActive(false);
    } else if (action === "next" && index < tourSteps.length) {
      const nextStep = tourSteps[index];
      if (nextStep.action) {
        nextStep.action({navigate});
      }
      
      // Handle navigation for the "Create Form" button to Form Builder page
      // if (nextStep.path === ROUTES.CREATE_FORMS) {
      //   navigate(ROUTES.CREATE_FORMS);
      // } else if (nextStep.path !== location.pathname) {
      //   navigate(nextStep.path);
      // }
    }
  };

  const steps: Step[] = tourSteps.map(({path,action,...step}) => ({
    ...step
  }));

  return (
    <Joyride
      steps={steps}
      run={isTourActive}
      continuous
      scrollToFirstStep
      showSkipButton
      showProgress
      // @ts-ignore
      disableBeacon
      spotlightPadding={10}
      callback={handleTourCallback}
      styles={{
        overlay: {
          // border: "6px solid lightblue",
        },
        spotlight: {
          border: "2px solid lightblue",
        },
        buttonClose: {
          marginTop: "5px",
          marginRight: "5px",
          width: "12px",
        },
        buttonNext: {
          outline: "2px solid transparent",
          outlineOffset: "2px",
          backgroundColor: "#1c7bd4",
          borderRadius: "5px",
          color: "#FFFFFF",
        },
        buttonSkip: {
          color: "A3A3A3",
        },
        tooltipFooter: {
          margin: "0px 16px 10px 10px",
        },
        buttonBack: {
          outline: "2px solid transparent",
          outlineOffset: "2px",
        },
        options: {
          zIndex: 100,
          arrowColor: "#1F1F1F",
          backgroundColor: "#1F1F1F",
          textColor: "#FFFFFF",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#1c7bd4",
        },
      }}
    />
  );
};

export default TourManager;
