---
name: User story
about: Custom template for user stories.
title: 'USER STORY: <Template>'
labels: ''
assignees: ''

---

As a **role** I can **capability**, so that **received benefit**.
As a **role** I want to **action**, so that **received benefit**.
In order to **receive benefit** as a **role**, I can **action**.

examples:
As a **warehouse employee**, I can **select the paper size on which to print** so that **the printed label size matches the parcel size**.
As a **Spotify podcast listener** I want to **save podcasts as my favourites**, so that **I can create my own custom list of favourite podcasts**.
In order to **provide anonymous feedback** as a **user**, I can **choose to hide my identity in the poll response**.


### Acceptance criteria
- <AC1>

examples:
### Acceptance criteria
- Order details include Order ID, the shipping address and the list of items in the parcel
- The warehouse employee can select the size of the order details from 3 sizes (A4, A5 and A6)
- Font size used is 12 points.

### Acceptance criteria
- The option should be provided as a checkbox
- The checkbox should be “checked” by default
- The option should appear next to the submit button
- After submitting the default submission confirmation should be adjusted to include the user name.

***

### Acceptance criteria (Given/When/Then):
- **Given** - context or pre-condition
- **When** - some action is carried out
- **Then** - observable outcome and expected results

examples: 
- **Given** - The Spotify app displays podcasts
- **When** - I click the favourite icon that is displayed by each podcast
- **Then** - the podcast gets saved
- **And** - is displayed in my favourite list


### Tasks:
- [ ] task1
- [ ] task2

example (for label printing):
### Tasks:
- [ ] Design a "print" icon and add it to the order details page
- [ ] Design the print layouts for the different page sizes
- [ ] Create the HTML and CSS for the dropdown menu including the paper sizes
- [ ] Create the code for the model, viewer and controller
- [ ] Test the completed functionality
