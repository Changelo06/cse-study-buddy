import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/lessons/$lessonId/final-exam/$levelId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/lessons/$lessonId/final-exam/$levelId"!</div>
}
