// Simple in-memory todo list for UI interactions
document.addEventListener('DOMContentLoaded', () => {
	const addForm = document.getElementById('addForm');
	const textInput = document.getElementById('textInput');
	const dateInput = document.getElementById('dateInput');
	const taskBody = document.getElementById('taskBody');
	const deleteAllBtn = document.getElementById('deleteAllBtn');
	const filterBtn = document.getElementById('filterBtn');

	let tasks = [];
	let filtered = false;

	function render() {
		taskBody.innerHTML = '';
		const list = filtered ? tasks.filter(t => !t.done) : tasks;
		if (list.length === 0) {
			const tr = document.createElement('tr');
			tr.className = 'empty-row';
			tr.innerHTML = '<td colspan="4">No task found</td>';
			taskBody.appendChild(tr);
			return;
		}

		list.forEach((task, idx) => {
			const tr = document.createElement('tr');

			const tdTask = document.createElement('td');
			tdTask.innerHTML = `<div class=\"task-name\">${escapeHtml(task.text)}</div>`;

			const tdDate = document.createElement('td');
			tdDate.textContent = task.due || '-';

			const tdStatus = document.createElement('td');
			const statusBtn = document.createElement('button');
			statusBtn.className = 'status-toggle';
			statusBtn.textContent = task.done ? 'Done' : 'Pending';
			statusBtn.addEventListener('click', () => {
				task.done = !task.done;
				render();
			});
			tdStatus.appendChild(statusBtn);

			const tdActions = document.createElement('td');
			const del = document.createElement('button');
			del.className = 'btn action-btn';
			del.textContent = 'Delete';
			del.addEventListener('click', () => {
				tasks = tasks.filter((_, i) => i !== idx);
				render();
			});
			tdActions.appendChild(del);

			tr.appendChild(tdTask);
			tr.appendChild(tdDate);
			tr.appendChild(tdStatus);
			tr.appendChild(tdActions);
			taskBody.appendChild(tr);
		});
	}

	function escapeHtml(s){
		return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
	}

	addForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const text = textInput.value.trim();
		const due = dateInput.value;
		if (!text) return;
		tasks.push({text, due, done:false});
		textInput.value = '';
		dateInput.value = '';
		render();
	});

	deleteAllBtn.addEventListener('click', () => {
		if (!tasks.length) return;
		if (!confirm('Delete all tasks?')) return;
		tasks = [];
		render();
	});

				filterBtn.addEventListener('click', () => {
					filtered = !filtered;
					filterBtn.classList.toggle('active', filtered);
					render();
				});

	// initial render
	render();
});
