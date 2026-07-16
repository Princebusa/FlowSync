import { createContext, useContext, type ReactNode } from "react";

type EditNodeFn = (nodeId: string) => void;

const EditNodeContext = createContext<EditNodeFn | null>(null);

export function EditNodeProvider({
  children,
  onEdit,
}: {
  children: ReactNode;
  onEdit: EditNodeFn;
}) {
  return <EditNodeContext.Provider value={onEdit}>{children}</EditNodeContext.Provider>;
}

export function useEditNode() {
  return useContext(EditNodeContext);
}
