function resize({ target }) {
  target.style.height = "1px";
	target.style.height = (+target.scrollHeight)+"px";	
}
  
export function autoresize(el) {
	resize({ target: el });
	el.style.overflow = 'hidden';
	el.addEventListener('input', resize);
	
	return {
		destroy: () => el.removeEventListener('input', resize)
	}
}