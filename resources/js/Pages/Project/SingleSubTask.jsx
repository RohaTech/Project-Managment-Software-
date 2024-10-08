import TextInput from "@/Components/TextInput";
import { Link, useForm } from "@inertiajs/react";
import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "SUbTASK";

function SingleSubTask({
  subtask,
  handleToggle,
  openTasks,
  members,
  level,
  role,
  index,
  moveRow,
  parent_task_id,
}) {
  const [, ref] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (
        draggedItem.index !== index ||
        draggedItem.parent_task_id !== parent_task_id
      ) {
        moveRow(draggedItem.index, index, parent_task_id);
        draggedItem.index = index;
        draggedItem.parent_task_id = parent_task_id;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const statusOptions = [
    { value: "Not Started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
    { value: "Postponed", label: "Postponed" },
  ];
  // console.log(tasks);
  const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const { data, setData, patch, errors } = useForm({
    name: subtask.name,
    assigned: subtask.assigned,
    status: subtask.status,
    priority: subtask.priority,
    due_date: subtask.due_date,
  });

  const handleSubtaskSubmit = (e) => {
    e.preventDefault();
    patch(`/task/${subtask.id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return (
    <tr
      className={`bg-gray-${100 + level * 50}`}
      ref={(node) => drag(ref(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <td className="px-4 py-1 border border-l-0 border-slate-300 flex items-center group transition duration-600 ease-in-out">
        <span
          className="cursor-pointer"
          onClick={() => handleToggle(subtask.id)}
        >
          {openTasks[subtask.id] ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              width="15"
              height="15"
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 512"
              width="15"
              height="15"
            >
              <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
            </svg>
          )}
        </span>
        <form onSubmit={handleSubtaskSubmit} className="flex-grow">
          <TextInput
            value={data.name}
            id="name"
            onChange={(e) => setData("name", e.target.value)}
            onBlur={handleSubtaskSubmit}
            className="border-0 w-full focus:ring-1 focus:border-slate-300"
          />
        </form>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="18"
          height="18"
          viewBox="0 0 25 25"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-2000 ease-in-out cursor-pointer"
        >
          <path d="M17.85,12.85l-10,10a.48.48,0,0,1-.7,0,.48.48,0,0,1,0-.7l9.64-9.65L7.15,2.85a.49.49,0,0,1,.7-.7l10,10A.48.48,0,0,1,17.85,12.85Z"></path>
        </svg>
      </td>
      <td className="px-4 py-1 border border-slate-300">
        <select
          className="border-0"
          onChange={(e) => setData("assigned", e.target.value)}
          onBlur={handleSubtaskSubmit}
        >
          {members.map((member, index) => (
            <option
              key={index}
              value={member.id}
              selected={member.id === subtask.assigned}
            >
              {member.name}
            </option>
          ))}{" "}
        </select>
      </td>
      <td className="px-4 py-1 border border-slate-300">
        <select
          className="border-0"
          onChange={(e) => setData("status", e.target.value)}
          onBlur={handleSubtaskSubmit}
        >
          {statusOptions.map((status, index) => (
            <option
              key={index}
              value={status.value}
              selected={status.value === subtask.status}
            >
              {status.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-1 border border-slate-300">
        <select
          className="border-0"
          onChange={(e) => setData("priority", e.target.value)}
          onBlur={handleSubtaskSubmit}
        >
          {priorityOptions.map((priority, index) => (
            <option
              key={index}
              value={priority.value}
              selected={priority.value === subtask.priority}
            >
              {priority.label}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-1 border border-slate-300">
        <input
          type="date"
          value={subtask.due_date ? formatDate(subtask.due_date) : ""}
          onChange={(e) => setData("due_date", e.target.value)}
          onBlur={handleSubtaskSubmit}
        />
      </td>
    </tr>
  );
}

export default SingleSubTask;
