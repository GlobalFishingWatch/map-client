# Contributing/PM guidelines

### Code review

See <a href="https://github.com/Vizzuality/guides/tree/master/code-review">Vizzuality Code Review guidelines</a>.

### Branches

- `master` reflects the version in production.
- `develop` reflects the version in staging and contains the features and bug fixes need for the next milestone
- `master` is updated when releasing the current milestone (develop -> master), and for the occasional hotfix.

### Developing features

- Features issues are created as individual Github issues.
- Features issues are grouped into `Epics` (see current list of <a href="https://github.com/Vizzuality/GlobalFishingWatch/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3AEpic%20">Epics</a>). Epics should ideally contain a user story and acceptance tests, as well as list of attached bugs and features, and when applicable a API spec.
- Feature issues are to be closed when the code is merged into develop. This can be done automatically (reference to the issue number in a commit) or manually. If despite code review, a feature is not considered done, a new issue should be opened as a `Bug`.

### Reporting a bug

- Skytruth or Vizzuality staff member opens an issue, attaching the label `bug`. (see <a href="https://github.com/Vizzuality/GlobalFishingWatch/issues?q=is%3Aissue+is%3Aopen+label%3Abug">current list of bugs</a>)
- A bug report should contain steps to reproduce, environment tested and when relevant screenshots, animated screenshots, browser specs.
- When applicable, the issue is attached to an Epic.
- When applicable, the issue is attached to a Milestone.
- Bug issues are to be closed when the code is merged into develop or master.
