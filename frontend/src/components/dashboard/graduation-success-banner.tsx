import { Trophy, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface GraduationSuccessBannerProps {
  earnedCredits: number;
  requiredCredits: number;
}

export function GraduationSuccessBanner({
  earnedCredits,
  requiredCredits,
}: GraduationSuccessBannerProps) {
  return (
    <Card className="border-green-200 bg-linear-to-r from-green-50 to-emerald-50 dark:border-green-900 dark:from-green-950/20 dark:to-emerald-950/20">
      <CardContent className="flex items-start gap-3 py-4">
        <div className="rounded-full bg-green-100 p-2 text-green-700 dark:bg-green-900/40 dark:text-green-300">
          <Trophy className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-green-800 dark:text-green-300">
            Graduation successful
            <Sparkles className="h-4 w-4" />
          </p>
          <p className="text-sm text-green-700 dark:text-green-400">
            You reached {earnedCredits}/{requiredCredits} credits and completed
            your graduation requirement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
