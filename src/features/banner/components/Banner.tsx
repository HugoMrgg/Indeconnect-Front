export const Banner = () => {
    return (
        <section className="relative bg-beige text-white flex justify-between items-center overflow-hidden">
            <div className="p-12 md:p-20 max-w-xl">
                <h1 className="text-5xl font-serif leading-tight">New Fashion Collection</h1>
                <div className="mt-6 h-[2px] w-24 bg-white/50"></div>
            </div>
            <div className="relative">
                <img
                    src="/images/fashion.jpg"
                    alt="Fashion clothes"
                    className="h-[350px] w-auto object-cover shadow-2xl rounded-l-2xl"
                />
            </div>
        </section>
    );
};
