const Footer = () => {
  return (
    <div className="text-center p-5 border-t border-slate-600">
      © {new Date().getFullYear()}{' '}
      <a
        href="https://robertocinetto.com"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        robertocinetto.com
      </a>
    </div>
  )
}

export default Footer
