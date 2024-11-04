function table_pegination(){

    

	const data = Array.from({ length: 100 }, (_, index) => { // Change length to 100 for example
		const id = index + 1;
		return {
			id,
			name: `User ${id}`,
			email: `user${id}@example.com`
		};
	});

	const rowsPerPage = 10;
	let currentPage = 1;

	function displayTableData(page) {
		const tableBody = document.getElementById("table-body");
		tableBody.innerHTML = ""; // Clear previous rows
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		const paginatedData = data.slice(start, end);

		paginatedData.forEach(row => {
			const tr = document.createElement("tr");
			tr.innerHTML = `<td>${row.id}</td><td>${row.name}</td><td>${row.email}</td>`;
			tableBody.appendChild(tr);
		});
	}

	function changePage(page) {
		const maxPage = Math.ceil(data.length / rowsPerPage);
		if (page >= 1 && page <= maxPage) {
			currentPage = page;
			displayTableData(currentPage);
			renderPagination(maxPage);
		}
	}

	function renderPagination(totalPages) {
		const pagination = document.getElementById("pagination");
		pagination.innerHTML = "";

		// Previous button
		const prevButton = document.createElement("li");
		prevButton.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
		prevButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>`;
		pagination.appendChild(prevButton);

		// Page numbers
		const maxVisiblePages = 3;
		let startPage = Math.max(1, currentPage - maxVisiblePages);
		let endPage = Math.min(totalPages, currentPage + maxVisiblePages);

		// Adjusting the start and end page range
		if (currentPage - maxVisiblePages < 1) {
			endPage = Math.min(totalPages, endPage + (1 - (currentPage - maxVisiblePages)));
			startPage = 1;
		}
		if (currentPage + maxVisiblePages > totalPages) {
			startPage = Math.max(1, startPage - ((currentPage + maxVisiblePages) - totalPages));
			endPage = totalPages;
		}

		// Adding first page
		if (startPage > 1) {
			pagination.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
			if (startPage > 2) {
				pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
			}
		}

		// Adding visible page numbers
		for (let i = startPage; i <= endPage; i++) {
			const pageItem = document.createElement("li");
			pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
			pageItem.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
			pagination.appendChild(pageItem);
		}

		// Adding last page
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pagination.innerHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
			}
			pagination.innerHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
		}

		// Next button
		const nextButton = document.createElement("li");
		nextButton.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
		nextButton.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>`;
		pagination.appendChild(nextButton);
	}

	// Initialize table and pagination
	displayTableData(currentPage);
	renderPagination(Math.ceil(data.length / rowsPerPage));

}