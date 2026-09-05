import type { Priority } from "../types/todo";

const CLASS_BY_PRIORITY: Record<Priority, string> = {
  LOW: "badge badge-low",
  MEDIUM: "badge badge-medium",
  HIGH: "badge badge-high",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={CLASS_BY_PRIORITY[priority]}>{priority}</span>;
}
