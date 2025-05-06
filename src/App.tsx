import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash, Edit, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Expense = {
  id: string
  description: string
  amount: number
  category: string
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')

  // Load expenses from localStorage on initial render
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category: category || 'Uncategorized'
    }

    setExpenses([...expenses, newExpense])
    resetForm()
  }

  const updateExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount || !editingId) return

    setExpenses(expenses.map(expense => 
      expense.id === editingId 
        ? { ...expense, description, amount: parseFloat(amount), category: category || 'Uncategorized' }
        : expense
    ))

    setEditingId(null)
    resetForm()
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  const startEditing = (expense: Expense) => {
    setEditingId(expense.id)
    setDescription(expense.description)
    setAmount(expense.amount.toString())
    setCategory(expense.category)
  }

  const cancelEditing = () => {
    setEditingId(null)
    resetForm()
  }

  const resetForm = () => {
    setDescription('')
    setAmount('')
    setCategory('')
  }

  const filteredExpenses = filter === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filter)

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount, 0
  )

  const categories = [
    'Food', 'Transportation', 'Housing', 'Entertainment', 
    'Utilities', 'Healthcare', 'Shopping', 'Uncategorized'
  ]

  return (
    <div className='bg-red-100 min-h-screen p-4'>
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {editingId ? 'Edit Expense' : 'Add New Expense'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingId ? updateExpense : addExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {categories.map(cat => (
                    <SelectItem className="bg-white hover:bg-gray-200 cursor-pointer" key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" variant="outline" className='bg-black text-white'>
                {editingId ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Update
                  </>
                ) : (
                  'Add Expense'
                )}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={cancelEditing}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl font-bold">Expenses</CardTitle>
          <div className="mt-4 md:mt-0">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredExpenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses found. Add some to get started!
            </p>
          ) : (
            <div className="space-y-2">
              {filteredExpenses.map(expense => (
                <div 
                  key={expense.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category} • ${expense.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => startEditing(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteExpense(expense.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <p className="text-lg font-medium">Total Spent:</p>
            <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
          </div>
          {filter !== 'all' && (
            <p className="text-sm text-muted-foreground mt-2">
              Showing expenses for: {filter}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  )
}