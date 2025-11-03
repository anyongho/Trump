import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "데이터를 불러오는 중..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
