import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function Partners() {
    return (
        <section className="bg-background pb-16 pt-16 md:pb-32">
            <div className="group relative m-auto max-w-5xl px-6">
                <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <Link
                        to="/"
                        className="block text-sm duration-150 hover:opacity-75">
                        <span> Meet Our Customers</span>

                        <ChevronRight className="ml-1 inline-block size-3" />
                    </Link>
                </div>
                <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                    <div className="flex">
                        <img
                            className="mx-auto h-5 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=20&fit=crop"
                            alt="Nvidia Logo"
                            height="20"
                            width="auto"
                        />
                    </div>

                    <div className="flex">
                        <img
                            className="mx-auto h-4 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=16&fit=crop"
                            alt="Column Logo"
                            height="16"
                            width="auto"
                        />
                    </div>
                    <div className="flex">
                        <img
                            className="mx-auto h-4 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=16&fit=crop"
                            alt="GitHub Logo"
                            height="16"
                            width="auto"
                        />
                    </div>
                    <div className="flex">
                        <img
                            className="mx-auto h-5 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=20&fit=crop"
                            alt="Nike Logo"
                            height="20"
                            width="auto"
                        />
                    </div>
                    <div className="flex">
                        <img
                            className="mx-auto h-5 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=20&fit=crop"
                            alt="Lemon Squeezy Logo"
                            height="20"
                            width="auto"
                        />
                    </div>
                    <div className="flex">
                        <img
                            className="mx-auto h-4 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=16&fit=crop"
                            alt="Laravel Logo"
                            height="16"
                            width="auto"
                        />
                    </div>
                    <div className="flex">
                        <img
                            className="mx-auto h-7 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=28&fit=crop"
                            alt="Lilly Logo"
                            height="28"
                            width="auto"
                        />
                    </div>

                    <div className="flex">
                        <img
                            className="mx-auto h-6 w-fit dark:invert"
                            src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=24&fit=crop"
                            alt="OpenAI Logo"
                            height="24"
                            width="auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}