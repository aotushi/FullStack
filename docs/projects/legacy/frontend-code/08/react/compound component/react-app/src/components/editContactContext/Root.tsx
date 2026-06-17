import { useState, createContext, useContext } from "react";
import { Dispatch, SetStateAction } from "react";
export interface FormData {
  name: string;
  email: string;
  phone: string;
}

type RootProps = {
  contactId: string;
  children: React.ReactNode;
};

type EditContactContext = {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>; 
  handleSubmit: () => void;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>
  error: string;
  setError: Dispatch<SetStateAction<string>>
};

function Root({ contactId, children }: RootProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await {
        id: contactId,
        ...formData,
      };
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    formData,
    setFormData,
    handleSubmit,
    loading,
    setLoading,
    error,
    setError
  };

  return <EditContactContext.Provider value={contextValue}>{children}</EditContactContext.Provider>;
}

const EditContactContext = createContext<EditContactContext | null>(null);

function useEditContactContext() {
  const context = useContext(EditContactContext);

  if (!context) {
    throw new Error("子组件必须位于EditContact.Root中");
  }

  return context;
}

export { Root, useEditContactContext };
