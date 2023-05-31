import {
	AiFillDelete,
	AiFillEdit,
	AiFillCheckCircle,
	AiFillCloseCircle,
} from "react-icons/ai";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
function App() {
	const [editID, setEditId] = useState();
	const transName = useRef();
	const transAmount = useRef();
	const transType = useRef();
	const editTransName = useRef();
	const editTransAmount = useRef();
	const editTransType = useRef();
	const createTransactionMutation = useMutation({
		mutationFn: async () => {
			try {
				return await axios.post(
					"http://localhost:5000/transaction/new-transaction",
					{
						name: transName.current.value,
						trans_type: transType.current.value,
						amount: transAmount.current.value,
						balance_id: 1,
					}
				);
			} catch (error) {
				throw error;
			}
		},
	});
	const editTransactionMutation = useMutation({
		mutationFn: async () => {
			try {
				return await axios.patch(
					"http://localhost:5000/transaction/edit-transaction",
					{
						name: editTransName.current.value,
						trans_type: editTransType.current.value,
						amount: editTransAmount.current.value,
						balance_id: 1,
					}
				);
			} catch (error) {
				throw error;
			}
		},
	});
	const deleteTransactionMutation = useMutation({
		mutationFn: async (id) => {
			try {
				return await axios.delete(
					`http://localhost:5000/transaction/delete-transaction/${id}`
				);
			} catch (error) {
				throw error;
			}
		},
	});
	const handleDelete = (id) => {
		deleteTransactionMutation.mutate(id);
	};
	const handleEdit = () => {
		editTransactionMutation.mutate();
	};
	const handleSubmit = () => {
		createTransactionMutation.mutate();
	};
	const getBalance = useQuery({
		queryKey: ["balance"],
		queryFn: async () => {
			try {
				return await axios.get("http://localhost:5000/transaction");
			} catch (error) {
				throw error;
			}
		},
	});

	const getTransaction = useQuery({
		queryKey: ["transaction"],
		queryFn: async () => {
			try {
				return await axios.get("http://localhost:5000/transaction/all");
			} catch (error) {
				throw error;
			}
		},
	});

	return (
		<div className="flex justify-center items-center p-7">
			<div className="max-w-screen-sm w-full space-y-10">
				<div className="flex justify-center">
					<h1 className="text-2xl font-semibold">Expense Tracker</h1>
				</div>
				<div className="space-y-5 font-semibold">
					<div>
						<h3 className="text-lg">YOUR BALANCE</h3>
						<h2 className="text-3xl">
							IDR {getBalance.data?.data[0].balance.toLocaleString()}
						</h2>
					</div>
					<div className="flex justify-between max-w-lg w-full mx-auto shadow-md bg-white rounded-sm py-6">
						<div className="w-full flex flex-col items-center">
							<p>INCOME</p>
							<p className="text-green-400">
								IDR{" "}
								{getBalance.data?.data[0].transactions[1].total_amount.toLocaleString()}
							</p>
						</div>
						<div className="w-full flex flex-col items-center">
							<p>EXPENSE</p>
							<p className="text-red-400">
								IDR{" "}
								{getBalance.data?.data[0].transactions[0].total_amount.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
				<div className="space-y-3">
					<h2 className="text-xl font-semibold border-b-2">HISTORY</h2>
					<div className="space-y-2">
						{getTransaction.data?.data.map((value, index) => {
							return (
								<div key={index} className="group relative">
									<button
										className={`flex justify-between mx-auto w-[512px] bg-white rounded-sm p-3 border-r-8 border-${
											value.trans_type === "income" ? "green" : "red"
										}-400 shadow-md`}
									>
										<input
											ref={editTransName}
											className={`${
												editID === index ? "block" : "hidden"
											} w-24 bg-slate-300 p-1 rounded-sm`}
											type="text"
											defaultValue={value.name}
										/>
										<select
											ref={editTransType}
											id="type"
											className={`${
												editID === index ? "block" : "hidden"
											} text-sm p-1 w-min bg-slate-300 rounded-sm`}
										>
											<option>Choose transaction type</option>
											<option value="income">Income</option>
											<option value="expense">Expense</option>
										</select>
										<input
											ref={editTransAmount}
											className={`${
												editID === index ? "block" : "hidden"
											} w-24 bg-slate-300 p-1 rounded-sm`}
											type="number"
											defaultValue={value.amount}
										/>
										<p className={`${editID === index ? "hidden" : "block"}`}>
											{value.name}
										</p>
										<p className={`${editID === index ? "hidden" : "block"}`}>
											{value.trans_type === "income" ? "+" : "-"}
											{value.amount.toLocaleString()}
										</p>
									</button>
									<div
										className={`${
											editID === index ? "hidden" : "block"
										} absolute -z-10 flex space-x-2 top-3 right-20 group-hover:right-1 group-hover:z-0`}
									>
										<button onClick={() => setEditId(index)}>
											<AiFillEdit className="text-xl text-green-400" />
										</button>
										<button onClick={() => handleDelete(value.id)}>
											<AiFillDelete className="text-xl text-red-400" />
										</button>
									</div>
									<div
										className={`${
											editID === index ? "block" : "hidden"
										} absolute flex space-x-2 top-3 right-1`}
									>
										<button onClick={() => handleEdit}>
											<AiFillCheckCircle className="text-xl text-green-400" />
										</button>
										<button onClick={() => setEditId()}>
											<AiFillCloseCircle className="text-xl text-red-400" />
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className="space-y-3">
					<h2 className="text-xl font-semibold border-b-2">
						Add new transaction
					</h2>
					<form
						onSubmit={handleSubmit}
						className="space-y-5 font-semibold max-w-lg mx-auto"
					>
						<div className="space-y-2">
							<label>Transaction</label>
							<input
								ref={transName}
								className="w-full p-2 rounded-sm"
								type="text"
								placeholder="Enter text..."
							/>
						</div>
						<div className="space-y-2">
							<label>Amount</label>
							<input
								ref={transAmount}
								className="w-full p-2 rounded-sm"
								type="number"
								placeholder="Enter Amount..."
							/>
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium">
								Select an option
							</label>
							<select
								ref={transType}
								id="type"
								className="text-sm rounded-sm block w-full p-2.5"
							>
								<option>Choose transaction type</option>
								<option value="income">Income</option>
								<option value="expense">Expense</option>
							</select>
						</div>
						<div>
							<button
								disabled={createTransactionMutation.isLoading}
								className="bg-blue-400 text-white w-full p-3 rounded-md"
							>
								{createTransactionMutation.isLoading
									? "Loading..."
									: "Add transaction"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default App;
