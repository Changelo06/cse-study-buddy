import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/topics/$topicId/final-exam/$levelId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/topics/$topicId/final-exam/$levelId"!</div>
}
