const Index = ({ label, isSelected, onSelect }) => {
    return (
        <div
            className={`cursor-pointer transition ease-in-out delay-150 text-xs hover:bg-slate-500 hover:text-white rounded-full px-2 border ${isSelected ? 'bg-slate-500 text-white border-transparent' : 'bg-white text-slate-700'} `}
            onClick={onSelect}
        >
            {label}
        </div>
    );
}

export default Index;
