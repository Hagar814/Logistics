frappe.ui.form.on('Freight', {

	refresh(frm) {

		if (!frm.is_new()) {

			let state = frm.doc.workflow_state;

			if (state === "Arrived") {
				frm.add_custom_button('Create Sales Invoice', () => {

					let sales_doc = frappe.model.get_new_doc('Sales Invoice');
					sales_doc.custom_freight = frm.doc.name;

					frappe.set_route('Form', 'Sales Invoice', sales_doc.name);
				});
			}

			if (state === "Arrived" || state === "Shipped") {
				frm.add_custom_button('Create Customs Clearance', () => {

					let customs_doc = frappe.model.get_new_doc('Customs Clearance');
					customs_doc.freight = frm.doc.name;

					frappe.set_route('Form', 'Customs Clearance', customs_doc.name);
				});
			}
		}

	},

	// 🔹 Address & Contact triggers
	agent_address: frm => handle_address(frm, "agent_address", "agent_address_"),
	shipper_address: frm => handle_address(frm, "shipper_address", "shipper_address_"),
	consignee_address: frm => handle_address(frm, "consignee_address", "consignee_address_"),

	agent_contact: frm => handle_contact(frm, "agent_contact", "agent_contact_"),
	shipper_contact: frm => handle_contact(frm, "shipper_contact", "shipper_contact_"),
	consignee_contact: frm => handle_contact(frm, "consignee_contact", "consignee_contact_")

});


// ==============================
// 🔹 Generic Handlers
// ==============================

function set_address_and_contact(frm) {

	let mappings = [
		{ field: "agent_address", display: "agent_address_", type: "address" },
		{ field: "shipper_address", display: "shipper_address_", type: "address" },
		{ field: "consignee_address", display: "consignee_address_", type: "address" },

		{ field: "agent_contact", display: "agent_contact_", type: "contact" },
		{ field: "shipper_contact", display: "shipper_contact_", type: "contact" },
		{ field: "consignee_contact", display: "consignee_contact_", type: "contact" }
	];

	mappings.forEach(row => {
		if (frm.doc[row.field]) {
			if (row.type === "address") {
				handle_address(frm, row.field, row.display);
			} else {
				handle_contact(frm, row.field, row.display);
			}
		}
	});
}


// 🔹 Address handler
function handle_address(frm, source_field, target_field) {

	if (frm.doc[source_field]) {
		erpnext.utils.get_address_display(frm, source_field, target_field, false);

		setTimeout(() => {
			let val = frm.doc[target_field] || "";

			let lines = val.split("<br>")
				.map(l => l.trim())
				.filter(l => l && l !== "Phone:" && l !== "Email:")
				.filter((v, i, a) => a.indexOf(v) === i);

			let formatted = lines.map(line => {
				if (line.toLowerCase().includes("phone")) {
					return line.replace("Phone:", "📞 ");
				}
				return line;
			});

			// ✅ Use newline instead of <br>
			frm.set_value(target_field, formatted.join("\n"));

		}, 300);

	} else {
		frm.set_value(target_field, "");
	}
}


// 🔹 Contact handler
function handle_contact(frm, source_field, target_field) {

	if (frm.doc[source_field]) {
		get_custom_contact_display(frm, frm.doc[source_field], target_field);
	} else {
		frm.set_value(target_field, "");
	}
}


// 🔹 Contact display (dynamic for ALL fields)
function get_custom_contact_display(frm, contact_name, target_field) {

	frappe.call({
		method: "frappe.contacts.doctype.contact.contact.get_contact_details",
		args: { contact: contact_name },
		callback(r) {

			if (r.message) {

				let d = r.message;
				let parts = [];

				if (d.contact_display) {
					parts.push(d.contact_display);
				}

				if (d.contact_email) {
					parts.push( d.contact_email);
				}

				if (d.contact_mobile) {
					parts.push( d.contact_mobile);
				} else if (d.contact_phone) {
					parts.push( d.contact_phone);
				}

				// ✅ newline instead of <br>
				frm.set_value(target_field, parts.join("\n"));
			}
		}
	});
}