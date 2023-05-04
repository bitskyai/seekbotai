/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Container, Typography } from "@mui/material";
import { usePageEffect } from "../../core/page.js";

export default function AccountDetails(): JSX.Element {
  usePageEffect({ title: "Account Details" });

  return (
    <Container sx={{ my: 4 }} maxWidth="sm">
      <Typography sx={{ mb: 4 }} variant="h2" children="Account Details" />
    </Container>
  );
}
