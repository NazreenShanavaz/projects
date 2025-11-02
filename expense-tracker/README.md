# 💸 Expense Tracker 

A beautiful and user-friendly desktop application for tracking personal expenses built with Python Tkinter and SQLite.

## 🎯 What it does

The Expense Tracker is a desktop application that helps you:
- **Add and manage expenses** with categories, dates, amounts, and notes
- **View all expenses** in a clean, organized table format
- **Export data** to CSV files for backup or analysis
- **Visualize spending patterns** with charts (when matplotlib is installed)

## ✨ Features

### 🎨 Beautiful User Interface
- **Soft pastel design** with light blue background (`#f0f8ff`)
- **Modern styling** with Segoe UI fonts and clean typography
- **Emoji icons** for categories and buttons for better visual appeal
- **Hover effects** on interactive elements
- **Alternating row colors** in the expense table

### 📝 Core Functionality
- **Add Expenses**: Fill out a form with date, category, amount, and optional notes
- **View Expenses**: See all expenses in a scrollable table with sorting
- **Category Management**: 20+ predefined categories with emoji icons:
  - 🍔 Food, 🚌 Transport, ⚡ Utilities, 🛍️ Shopping
  - 🏥 Health, 🎬 Entertainment, 📚 Study, 🏠 Home
  - 🎮 Gaming, 💄 Beauty, 📱 Technology, 🎨 Hobbies
  - ✈️ Travel, 🍕 Dining Out, 🏋️ Fitness, 📖 Books
  - 🎵 Music, 🎭 Movies, 💊 Medicine, 🔧 Other

### 📊 Data Management
- **SQLite Database**: Reliable local storage for all expense data
- **CSV Export**: Export all expenses to CSV files for backup or analysis
- **Real-time Updates**: Table refreshes automatically when new expenses are added

### 📈 Charts & Analytics (Optional)
- **Pie Charts**: Show expense distribution by category
- **Line Charts**: Display spending trends over time
- **Interactive Charts**: Tabbed interface for different chart types

## 🚀 How to Run

### Prerequisites
- Python 3.7 or higher
- Tkinter (usually comes with Python)

### Installation

1. **Clone or download** the project files:
   ```
   expense-tracker/
   ├── main_simple.py    # Main application (no external dependencies)
   ├── main.py          # Full version with charts (requires matplotlib)
   ├── db.py            # Database helper functions
   ├── requirements.txt # Python dependencies
   └── README.md        # This file
   ```

2. **Install dependencies** (optional, for charts):
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:

   **Option A: Simple version (recommended)**
   ```bash
   python main_simple.py
   ```

   **Option B: Full version with charts**
   ```bash
   python main.py
   ```

### Quick Start

1. **Launch the app** - You'll see the beautiful interface with a form at the top
2. **Add an expense**:
   - Select today's date (or choose another date)
   - Pick a category from the dropdown
   - Enter the amount
   - Add an optional note
   - Click "➕ Add Expense"
3. **View your expenses** in the table below
4. **Export data** by clicking "📄 Export CSV"

## 📁 File Structure

```
expense-tracker/
├── main_simple.py          # Main application (no external deps)
├── main.py                # Full version with matplotlib charts
├── db.py                  # SQLite database operations
├── requirements.txt       # Python package dependencies
├── expenses.db           # SQLite database (created automatically)
├── README.md             # Project documentation
└── test_matplotlib.py    # Test file for matplotlib functionality
```

## 🛠️ Technical Details

### Database Schema
```sql
CREATE TABLE expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    note TEXT
);
```

### Dependencies
- **Standard Library**: `tkinter`, `sqlite3`, `csv`, `datetime`
- **Optional**: `matplotlib` (for charts)

### Supported Platforms
- ✅ Windows
- ✅ macOS
- ✅ Linux

## 📸 Screenshots

### Main Interface
![Main Interface](screenshots/main-interface.png)
*The main expense tracker interface with form and table*

### Adding an Expense
![Add Expense](screenshots/add-expense.png)
*Adding a new expense with category selection*

### Export Dialog
![Export CSV](screenshots/export-csv.png)
*Exporting expenses to CSV format*

### Charts View
![Charts](screenshots/charts-view.png)
*Pie chart showing expense distribution by category*

## 🔧 Customization

### Adding New Categories
Edit the `category_combo` values in `main_simple.py`:
```python
category_combo = ttk.Combobox(main, textvariable=category_var, values=[
    "🍔 Food",
    "🚌 Transport", 
    "⚡ Utilities",
    # Add your custom categories here
    "🎯 Your Category",
], state="readonly", width=22, font=('Segoe UI', 10))
```

### Changing Colors
Modify the color scheme in the style configurations:
```python
root.configure(bg='#f0f8ff')  # Background color
add_button = tk.Button(..., bg='#27ae60', ...)  # Button colors
```

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'matplotlib'"
- **Solution**: Use `main_simple.py` instead of `main.py`
- **Alternative**: Install matplotlib: `pip install matplotlib`

### App doesn't start
- **Check**: Python version (3.7+ required)
- **Check**: Tkinter is installed (usually comes with Python)

### Database errors
- **Check**: Write permissions in the project directory
- **Check**: No other app is using the database file

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving the UI/UX
- Adding new export formats

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with Python and Tkinter
- Icons provided by emoji characters
- Color scheme inspired by modern web design principles

---

**Happy Expense Tracking! 💸✨**
