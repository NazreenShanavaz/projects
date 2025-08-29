import tkinter as tk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

print("Matplotlib test starting...")

# Create a simple test window
root = tk.Tk()
root.title("Matplotlib Test")
root.geometry("400x300")

# Create a simple plot
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot([1, 2, 3, 4], [1, 4, 2, 3])
ax.set_title("Test Plot")

# Embed in tkinter
canvas = FigureCanvasTkAgg(fig, root)
canvas.draw()
canvas.get_tk_widget().pack()

print("Matplotlib test successful! Window should appear.")
root.mainloop()
