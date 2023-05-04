/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { usePageEffect } from "../../core/page.js";
import { Container, Typography } from "@mui/material";

export default function AccountDetails(): JSX.Element {
  usePageEffect({ title: "Account Details" });

  return (
    <Container sx={{ my: 4 }} maxWidth="sm">
      <Typography sx={{ mb: 4 }} variant="h2" children="Account Details" />
    </Container>
  );
}
