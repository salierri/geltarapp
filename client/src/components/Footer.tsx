import { AppBar, Container, Grid, Link, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import GitHubButton from 'react-github-btn';
import 'typeface-roboto';

export default () => (
  <AppBar position="sticky" className="bottom-0" color="inherit">
    <Container maxWidth="md">
      <Toolbar>
        <Grid
          justify="space-between"
          alignItems="center"
          container
        >
          <Grid item>
            <Typography variant="body2" color="inherit">
              Created by
              {' '}
              <Link href="https://github.com/salierri" color="inherit">@Salierri</Link>
            </Typography>
          </Grid>
          <Grid item className="no-padding">
            <Typography variant="body2" color="inherit" className="no-padding">
              <Link href="https://github.com/salierri/geltarapp/issues" color="inherit">Report a bug</Link>
            </Typography>
          </Grid>
          <Grid item>
            <GitHubButton
              href="https://github.com/salierri/geltarapp"
              data-color-scheme="no-preference: dark; light: light; dark: dark;"
              data-icon="octicon-star"
              data-size="large"
              aria-label="Star salierri/geltarapp on GitHub"
            >
              Star me on GitHub
            </GitHubButton>
          </Grid>
        </Grid>
      </Toolbar>
    </Container>
  </AppBar>
);
