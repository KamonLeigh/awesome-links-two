

type Props = {
    message: string
    className?: string
    
  };

function NoItems({ message, className = '' }: Props):JSX.Element  {
    return (
        <div className="container text-center">
        <p className={`text-2xl ${className}`}>{message}</p> 
      </div>
    )
}

export default NoItems