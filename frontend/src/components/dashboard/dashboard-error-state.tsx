import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DashboardErrorStateProps {
  onRetry: () => void;
}

export function DashboardErrorState({ onRetry }: DashboardErrorStateProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unable to load dashboard</CardTitle>
        <CardDescription>
          We could not fetch your student data right now.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Retry</Button>
      </CardContent>
    </Card>
  );
}
