# Million Rows Virtual Grid

## Project Overview
This project implements a high-performance data grid capable of rendering **1,000,000 financial transactions** efficiently using **virtual scrolling (windowing)**.

Rendering millions of DOM nodes directly causes severe performance issues and high memory usage. To solve this, the application renders only the rows currently visible in the viewport plus a small buffer.

As the user scrolls, the visible rows are recalculated and updated dynamically. This keeps the DOM size small and ensures smooth scrolling.

This technique is used in large enterprise applications such as financial dashboards, analytics tools, Google Sheets, and IDEs.

---

## Features

- Virtual scrolling for **1 million rows**
- Smooth scrolling with minimal DOM elements
- GPU optimized rendering using `transform: translateY`
- Floating debug panel with real-time metrics
- Column sorting
- Debounced filtering
- Quick filters by transaction status
- Single row selection
- Multi-row selection using **Ctrl**
- Double-click cell editing
- Sticky column pinning
- Docker containerized application

---

## Project Structure

```
million-grid/
│
├── public/
│   ├── index.html
│   ├── app.js
│   └── transactions.json
│
├── scripts/
│   └── generate-data.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Data Generation

The dataset is generated using a script that creates **1,000,000 transaction records**.

Each transaction record contains:

- id
- date
- merchant
- category
- amount
- status
- description

To generate the dataset run:

```
npm install
npm run generate-data
```

This will generate the file:

```
public/transactions.json
```

---

## Running the Application

### Using Docker

Run the application with:

```
docker-compose up
```

Open the application in your browser:

```
http://localhost:8080
```

The application will load the 1 million row dataset and display the virtualized grid.

---

## Virtualization Approach

The grid uses a **windowing technique** to efficiently render large datasets.

The layout consists of:

1. **Scroll Container**  
   A scrollable viewport that handles user scrolling.

2. **Sizer Element**  
   A hidden element that simulates the full height of 1 million rows.

3. **Window Element**  
   Contains only the rows currently visible in the viewport.

4. **Row Rendering Logic**

When the user scrolls:

- The visible row indexes are calculated
- Only those rows are rendered
- The row container is repositioned using

```
transform: translateY(scrollOffset)
```

This ensures only a small number of rows (~20–40) exist in the DOM at any time.

---

## Debug Panel

A floating debug panel shows real-time performance metrics.

Metrics displayed:

- FPS → Frames per second during scrolling
- Rows Rendered → Number of rows currently in DOM
- Scroll Position → Index of the first visible row

This helps monitor grid performance.

---

## Sorting

Users can sort the dataset by clicking the **Amount column header**.

Sorting toggles between:

- Ascending
- Descending

The sort is applied to the full dataset.

---

## Filtering

Users can filter transactions using the **merchant search input**.

The filter is **debounced** to prevent expensive filtering operations on every keystroke.

Example search:

```
TechCorp
```

The grid updates automatically to show matching rows.

---

## Quick Filters

Buttons are provided to quickly filter transactions by status:

- Completed
- Pending

The grid updates to display only rows matching the selected status.

---

## Row Selection

Two types of row selection are supported.

Single Selection  
Click a row to select it.

Multi Selection  
Hold **Ctrl** while clicking multiple rows to select them simultaneously.

Selected rows are highlighted.

---

## Cell Editing

Merchant cells can be edited directly.

Steps:

1. Double click the merchant cell
2. An input field appears
3. Edit the value
4. Press **Enter** or click outside

The updated value is saved in the dataset.

---

## Column Pinning

The **ID column** can be pinned using the pin button.

Pinned columns remain visible during horizontal scrolling.

This is implemented using CSS:

```
position: sticky
```

---

## Performance

Even with **1,000,000 rows**, the grid maintains smooth performance because:

- Only visible rows are rendered
- DOM elements remain minimal
- GPU accelerated transforms are used
- Scroll updates use `requestAnimationFrame`

---

## Technologies Used

- Vanilla JavaScript
- HTML
- CSS
- Virtual Scrolling
- Docker
- Nginx

---

## Author

Sailaja