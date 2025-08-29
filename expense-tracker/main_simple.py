import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from datetime import date
import csv

from db import init_db, insert_expense, fetch_all


def export_to_csv():
    """Export all expenses to a CSV file."""
    try:
        # Get all expenses from database
        expenses = fetch_all()
        
        if not expenses:
            messagebox.showwarning("No Data", "No expenses to export.")
            return
        
        # Ask user where to save the file
        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv"), ("All files", "*.*")],
            title="Save Expenses as CSV"
        )
        
        if not filename:  # User cancelled
            return
        
        # Write to CSV file
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            # Write header
            writer.writerow(['ID', 'Date', 'Category', 'Amount', 'Note'])
            
            # Write data
            for expense in expenses:
                writer.writerow(expense)
        
        messagebox.showinfo("Export Successful", f"Exported {len(expenses)} expenses to:\n{filename}")
        
    except Exception as exc:
        messagebox.showerror("Export Error", f"Could not export expenses: {exc}")


def add_expense():
    d = date_var.get().strip()
    c = category_var.get().strip()
    a = amount_var.get().strip()
    n = note_text.get("1.0", tk.END).strip()

    if not d or not c or not a:
        messagebox.showerror("Missing Data", "Please fill date, category, and amount.")
        return

    try:
        amount_value = float(a)
    except ValueError:
        messagebox.showerror("Invalid Amount", "Amount must be a number.")
        return

    try:
        insert_expense(d, c, amount_value, n or None)
    except Exception as exc:
        messagebox.showerror("Database Error", f"Could not save expense: {exc}")
        return

    messagebox.showinfo("Saved", "Expense added successfully.")
    amount_var.set("")
    note_text.delete("1.0", tk.END)
    refresh_table()


# Create main window with attractive styling
root = tk.Tk()
root.title("💸 Expense Tracker 💕")
root.geometry("750x580")
root.resizable(True, True)
root.configure(bg='#f0f8ff')  # Light blue background

# Configure styles
style = ttk.Style()
style.theme_use('clam')

# Configure colors
style.configure('Title.TLabel', 
                background='#f0f8ff', 
                foreground='#2c3e50', 
                font=('Segoe UI', 16, 'bold'))

style.configure('Label.TLabel', 
                background='#f0f8ff', 
                foreground='#34495e', 
                font=('Segoe UI', 10))

# Configure Treeview style
style.configure('Treeview', 
                background='#ffffff',
                foreground='#2c3e50',
                fieldbackground='#ffffff',
                font=('Segoe UI', 9))

style.configure('Treeview.Heading', 
                background='#ecf0f1',
                foreground='#2c3e50',
                font=('Segoe UI', 9, 'bold'))

style.map('Treeview', 
          background=[('alternate', '#f8f9fa')])

init_db()

# Main container with padding
main = ttk.Frame(root, padding=20)
main.pack(fill=tk.BOTH, expand=True)

# Title
title_label = ttk.Label(main, text="💸 Add New Expense 💕", style='Title.TLabel')
title_label.grid(row=0, column=0, columnspan=2, pady=(0, 20), sticky=tk.W)

# Date
ttk.Label(main, text="📅 Date (YYYY-MM-DD)", style='Label.TLabel').grid(row=1, column=0, sticky=tk.W, pady=(0, 8))
date_var = tk.StringVar(value=date.today().isoformat())
date_entry = ttk.Entry(main, textvariable=date_var, width=25, font=('Segoe UI', 10))
date_entry.grid(row=1, column=1, sticky=tk.W, padx=(10, 0))

# Category with icons
ttk.Label(main, text="🏷️ Category", style='Label.TLabel').grid(row=2, column=0, sticky=tk.W, pady=(0, 8))
category_var = tk.StringVar()
category_combo = ttk.Combobox(main, textvariable=category_var, values=[
    "🍔 Food",
    "🚌 Transport", 
    "⚡ Utilities",
    "🛍️ Shopping",
    "🏥 Health",
    "🎬 Entertainment",
    "📚 Study",
    "🏠 Home",
    "🎮 Gaming",
    "💄 Beauty",
    "📱 Technology",
    "🎨 Hobbies",
    "✈️ Travel",
    "🍕 Dining Out",
    "🏋️ Fitness",
    "📖 Books",
    "🎵 Music",
    "🎭 Movies",
    "💊 Medicine",
    "🔧 Other",
], state="readonly", width=22, font=('Segoe UI', 10))
category_combo.grid(row=2, column=1, sticky=tk.W, padx=(10, 0))
category_combo.set("🍔 Food")

# Amount
ttk.Label(main, text="💰 Amount", style='Label.TLabel').grid(row=3, column=0, sticky=tk.W, pady=(0, 8))
amount_var = tk.StringVar()
amount_entry = ttk.Entry(main, textvariable=amount_var, width=25, font=('Segoe UI', 10))
amount_entry.grid(row=3, column=1, sticky=tk.W, padx=(10, 0))

# Note
ttk.Label(main, text="📝 Note", style='Label.TLabel').grid(row=4, column=0, sticky=tk.NW, pady=(0, 8))
note_text = tk.Text(main, width=30, height=4, font=('Segoe UI', 10), bg='#ffffff', fg='#2c3e50')
note_text.grid(row=4, column=1, sticky=tk.W, padx=(10, 0))

# Buttons frame
button_frame = ttk.Frame(main)
button_frame.grid(row=5, column=0, columnspan=2, pady=20)

# Add button with emoji
add_button = tk.Button(button_frame, text="➕ Add Expense", command=add_expense,
                      bg='#27ae60', fg='white', font=('Segoe UI', 11, 'bold'),
                      relief=tk.FLAT, padx=20, pady=8, cursor='hand2')
add_button.pack(side=tk.RIGHT, padx=(0, 10))

# Export CSV button with emoji
export_button = tk.Button(button_frame, text="📄 Export CSV", command=export_to_csv,
                         bg='#f39c12', fg='white', font=('Segoe UI', 11, 'bold'),
                         relief=tk.FLAT, padx=20, pady=8, cursor='hand2')
export_button.pack(side=tk.RIGHT, padx=(0, 10))

# Charts button (disabled for now)
charts_button = tk.Button(button_frame, text="📊 Charts (Install matplotlib)", 
                         bg='#95a5a6', fg='white', font=('Segoe UI', 11, 'bold'),
                         relief=tk.FLAT, padx=20, pady=8, cursor='hand2', state='disabled')
charts_button.pack(side=tk.RIGHT)

for i in range(2):
    main.columnconfigure(i, weight=1)

# Separator
separator = ttk.Separator(main, orient=tk.HORIZONTAL)
separator.grid(row=6, column=0, columnspan=2, sticky=tk.EW, pady=20)

# Table title
table_title = ttk.Label(main, text="📋 Recent Expenses", style='Title.TLabel')
table_title.grid(row=7, column=0, columnspan=2, pady=(0, 10), sticky=tk.W)

# Table (Treeview) with alternating colors
columns = ("id", "date", "category", "amount", "note")
tree = ttk.Treeview(main, columns=columns, show="headings", height=10, style='Treeview')
tree.heading("id", text="ID")
tree.heading("date", text="📅 Date")
tree.heading("category", text="🏷️ Category")
tree.heading("amount", text="💰 Amount")
tree.heading("note", text="📝 Note")

tree.column("id", width=50, anchor=tk.CENTER)
tree.column("date", width=100)
tree.column("category", width=120)
tree.column("amount", width=100, anchor=tk.E)
tree.column("note", width=250)

vsb = ttk.Scrollbar(main, orient="vertical", command=tree.yview)
tree.configure(yscrollcommand=vsb.set)
table_row_index = 8
tree.grid(row=table_row_index, column=0, sticky=tk.NSEW, padx=(0, 5))
vsb.grid(row=table_row_index, column=1, sticky=tk.NS+tk.E)

main.rowconfigure(table_row_index, weight=1)


def refresh_table():
    for row in tree.get_children():
        tree.delete(row)
    try:
        rows = fetch_all()
    except Exception as exc:
        messagebox.showerror("Database Error", f"Could not load expenses: {exc}")
        return
    
    # Add alternating row colors
    for i, (rid, d, c, a, n) in enumerate(rows):
        tags = ('evenrow',) if i % 2 == 0 else ('oddrow',)
        tree.insert("", tk.END, values=(rid, d, c, f"${a:.2f}", n or ""), tags=tags)
    
    # Configure alternating row colors
    tree.tag_configure('oddrow', background='#f8f9fa')
    tree.tag_configure('evenrow', background='#ffffff')


refresh_table()

# Add hover effects for buttons
def on_enter(event):
    if event.widget == add_button:
        event.widget['bg'] = '#2ecc71'
    elif event.widget == export_button:
        event.widget['bg'] = '#e67e22'

def on_leave(event):
    if event.widget == add_button:
        event.widget['bg'] = '#27ae60'
    elif event.widget == export_button:
        event.widget['bg'] = '#f39c12'

add_button.bind('<Enter>', on_enter)
add_button.bind('<Leave>', on_leave)
export_button.bind('<Enter>', on_enter)
export_button.bind('<Leave>', on_leave)

root.mainloop()
