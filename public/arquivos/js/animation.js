export function showUI(ui, animation){
	ui.classList.remove("hidden")
	ui.classList.add("animate__animated", animation)
	ui.addEventListener("animationend", animationEndListener)

	function animationEndListener(){
		ui.classList.remove("animate__animated", animation)
		ui.removeEventListener("animationend", animationEndListener)
	}
}

export function removeUI(ui, animation){
	ui.classList.add("animate__animated", animation)
	ui.addEventListener("animationend", animationEndListener)

	function animationEndListener(){
		ui.classList.remove("animate__animated", animation)
		ui.classList.add("hidden")
		ui.removeEventListener("animationend", animationEndListener)
	}
}