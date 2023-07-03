import { IconCircleCheck } from "@tabler/icons-react";
import Feedback from "../../components/feedback";

export default function EmptyIssues() {
  return (
    <Feedback
      data-testid="EmptyIssues"
      mainText="Congrats!"
      secondaryText="There are no issues"
      Icon={IconCircleCheck}
    />
  );
}
