import { Container, Typography } from "@material-ui/core";
import { CategoryLinks } from "../FilterSidebar/CategoryLinks";

export function Home() {
  return (
    <Container>
      <Typography variant="h1">Pick a Category</Typography>
      <CategoryLinks />
    </Container>
  )
}